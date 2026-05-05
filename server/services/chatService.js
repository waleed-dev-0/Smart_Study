import DocumentChunk from "../models/documentchunk.js";
import aiService from "./aiService.js";
import ChatMessage from "../models/chatmessage.js";
import ChatSession from "../models/chatsession.js";
import mongoose from "mongoose";

class ChatService {
  async askQuestion(query, documentId, userId, provider = "gemini") {
    try {
      let session = await ChatSession.findOne({
        user_id: new mongoose.Types.ObjectId(userId),
        $or: [
          { document_id: new mongoose.Types.ObjectId(documentId) },
          { additional_documents: new mongoose.Types.ObjectId(documentId) }
        ]
      });

      if (!session) {
        session = await ChatSession.create({
          user_id: new mongoose.Types.ObjectId(userId),
          document_id: new mongoose.Types.ObjectId(documentId),
          title: `Discussion about ${documentId.slice(-6)}`,
        });
      }

      await ChatMessage.create({
        session_id: session._id,
        sender_type: "user",
        message_content: query,
      });

      console.log(
        `[Chat] Generating embedding for query: "${query.slice(0, 60)}..."`,
      );
      const queryEmbedding = await aiService.generateEmbedding(query);

      const docIds = [session.document_id];
      if (session.additional_documents && session.additional_documents.length > 0) {
        docIds.push(...session.additional_documents);
      }

      const allChunks = await DocumentChunk.find(
        { document_id: { $in: docIds } },
        { chunk_content: 1, embedding: 1 },
      ).limit(200);

      if (allChunks.length === 0) {
        throw new Error(
          "No indexed content found for these documents. Please re-upload.",
        );
      }

      const embeddedChunks = allChunks.filter(
        (c) => c.embedding && c.embedding.length > 0,
      );

      let context = "";
      if (embeddedChunks.length > 0) {
        const scoredChunks = embeddedChunks.map((chunk) => ({
          content: chunk.chunk_content,
          similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding),
        }));

        const topChunks = scoredChunks
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 5);

        context = topChunks.map((c) => c.content).join("\n\n---\n\n");
        console.log(
          `[Chat] Top similarity: ${topChunks[0]?.similarity?.toFixed(3)}, using ${topChunks.length} chunks as context.`,
        );
      } else {
        console.warn(
          "[Chat] No embedded chunks found — using raw text as context.",
        );
        context = allChunks
          .slice(0, 5)
          .map((c) => c.chunk_content)
          .join("\n\n---\n\n");
      }

      const pastMessages = await ChatMessage.find({ session_id: session._id })
        .sort({ createdAt: -1 })
        .limit(7);
      pastMessages.reverse();
      const historyStr = pastMessages
        .slice(0, -1)
        .map(
          (m) =>
            `${m.sender_type === "user" ? "Student" : "Assistant"}: ${m.message_content}`,
        )
        .join("\n\n");

      console.log(`[Chat] Sending to AI (provider: ${provider})...`);
      const answer = await aiService.askAI(
        query,
        context,
        provider,
        historyStr,
      );

      await ChatMessage.create({
        session_id: session._id,
        sender_type: "ai",
        message_content: answer,
      });

      const sources =
        embeddedChunks.length > 0
          ? embeddedChunks
              .filter((c) => {
                const score = this.cosineSimilarity(
                  queryEmbedding,
                  c.embedding,
                );
                return score > 0.7;
              })
              .slice(0, 3)
              .map((c) => c.chunk_content.slice(0, 150) + "...")
          : [];

      return { answer, sources };
    } catch (error) {
      console.error("[Chat] Service Error:", error.message);
      throw error;
    }
  }

  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    const result = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return isNaN(result) ? 0 : result;
  }
}

export default new ChatService();
