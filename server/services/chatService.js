import DocumentChunk from '../models/documentchunk.js';
import aiService from './aiService.js';
import ChatMessage from '../models/chatmessage.js';
import ChatSession from '../models/chatsession.js';
import mongoose from 'mongoose';

class ChatService {
  async askQuestion(
    query,
    documentId,
    userId,
    provider = 'gemini'
  ) {
    try {
      let session = await ChatSession.findOne({ 
        user_id: new mongoose.Types.ObjectId(userId),
        document_id: new mongoose.Types.ObjectId(documentId)
      });

      if (!session) {
        session = await ChatSession.create({
          user_id: new mongoose.Types.ObjectId(userId),
          document_id: new mongoose.Types.ObjectId(documentId),
          title: `Discussion about ${documentId.slice(-4)}`
        });
      }

      await ChatMessage.create({
        session_id: session._id,
        sender_type: 'user',
        message_content: query
      });

      const queryEmbedding = await aiService.generateEmbedding(query);

      const allChunks = await DocumentChunk.find({ 
        document_id: new mongoose.Types.ObjectId(documentId) 
      });
      
      const scoredChunks = allChunks.map(chunk => ({
        content: chunk.chunk_content,
        similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding)
      }));

      const topChunks = scoredChunks
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

      const context = topChunks.map(c => c.content).join('\n\n---\n\n');

      const answer = await aiService.askAI(query, context, provider);

      await ChatMessage.create({
        session_id: session._id,
        sender_type: 'ai',
        message_content: answer
      });

      return {
        answer,
        sources: topChunks.filter(c => c.similarity > 0.7).map(c => c.content.slice(0, 150) + '...')
      };
    } catch (error) {
      console.error('Chat Service Error:', error);
      throw new Error('Failed to process your request');
    }
  }

  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;
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
