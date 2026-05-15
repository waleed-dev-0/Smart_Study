import DocumentChunk from "../models/documentchunk.js";
import aiService from "./aiService.js";
import ChatMessage from "../models/chatmessage.js";
import ChatSession from "../models/chatsession.js";
import mongoose from "mongoose";

const CHUNK_LIMIT = 100;
const TOP_K = 5;

class ChatService {
  async _getContext(query, documentId, userId) {
    const uid = new mongoose.Types.ObjectId(userId);
    const did = new mongoose.Types.ObjectId(documentId);

    let session = await ChatSession.findOne({
      user_id: uid,
      $or: [{ document_id: did }, { additional_documents: did }],
    });

    if (!session) {
      session = await ChatSession.create({
        user_id: uid,
        document_id: did,
        title: `Discussion about ${documentId.slice(-6)}`,
      });
    }

    await ChatMessage.create({
      session_id: session._id,
      sender_type: "user",
      message_content: query,
    });

    const queryEmbedding = await aiService.generateEmbedding(query);

    const docIds = [session.document_id];
    if (session.additional_documents?.length > 0) {
      docIds.push(...session.additional_documents);
    }

    const chunks = await DocumentChunk.find(
      { document_id: { $in: docIds } },
      { chunk_content: 1, embedding: 1 },
    ).limit(CHUNK_LIMIT);

    if (chunks.length === 0) {
      throw new Error(
        "No indexed content found for these documents. Please re-upload.",
      );
    }

    const embedded = chunks.filter((c) => c.embedding?.length > 0);

    let context;
    let sources = [];

    if (embedded.length === 0) {
      context = chunks
        .slice(0, TOP_K)
        .map((c) => c.chunk_content)
        .join("\n\n---\n\n");
    } else {
      const scored = embedded
        .map((c) => ({
          content: c.chunk_content,
          score: this.cosineSimilarity(queryEmbedding, c.embedding),
        }))
        .sort((a, b) => b.score - a.score);

      context = scored
        .slice(0, TOP_K)
        .map((c) => c.content)
        .join("\n\n---\n\n");

      sources = embedded
        .filter((c) => this.cosineSimilarity(queryEmbedding, c.embedding) > 0.7)
        .slice(0, 3)
        .map((c) => c.chunk_content.slice(0, 150) + "...");

      console.log(
        `[Chat] Top similarity: ${scored[0]?.score?.toFixed(3)}, using ${Math.min(scored.length, TOP_K)} chunks.`,
      );
    }

    const history = await ChatMessage.find({ session_id: session._id })
      .sort({ createdAt: 1 })
      .limit(6);

    const historyStr = history
      .map(
        (m) =>
          `${m.sender_type === "user" ? "Student" : "Assistant"}: ${m.message_content}`,
      )
      .join("\n\n");

    return { session, context, sources, historyStr };
  }

  async askQuestion(query, documentId, userId, provider = "gemini") {
    const { session, context, sources, historyStr } = await this._getContext(
      query,
      documentId,
      userId,
    );

    const answer = await aiService.askAI(query, context, provider, historyStr);

    await ChatMessage.create({
      session_id: session._id,
      sender_type: "ai",
      message_content: answer,
    });

    return { answer, sources };
  }

  async askQuestionStream(query, documentId, userId, provider = "gemini") {
    const { session, context, sources, historyStr } = await this._getContext(
      query,
      documentId,
      userId,
    );

    const stream = aiService.askAIStream(query, context, provider, historyStr);

    return {
      stream,
      sources,
      async saveMessage(content) {
        await ChatMessage.create({
          session_id: session._id,
          sender_type: "ai",
          message_content: content,
        });
      },
    };
  }

  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0,
      normA = 0,
      normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    const result = dot / (Math.sqrt(normA) * Math.sqrt(normB));
    return isNaN(result) ? 0 : result;
  }
}

export default new ChatService();
