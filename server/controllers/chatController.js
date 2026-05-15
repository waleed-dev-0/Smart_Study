import chatService from '../services/chatService.js';
import ChatSession from '../models/chatsession.js';
import ChatMessage from '../models/chatmessage.js';
import mongoose from 'mongoose';

export const askAI = async (req, res) => {
  try {
    const { query, documentId, provider } = req.body;
    const userId = req.user?._id;

    if (!query || !documentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query and Document ID are required' 
      });
    }

    const result = await chatService.askQuestion(
      query,
      documentId,
      userId,
      provider,
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const askAIStream = async (req, res) => {
  try {
    const { query, documentId, provider } = req.body;
    const userId = req.user?._id;

    if (!query || !documentId) {
      return res.status(400).json({
        success: false,
        message: "Query and Document ID are required",
      });
    }

    const { stream, sources, saveMessage } =
      await chatService.askQuestionStream(
        query,
        documentId,
        userId,
        provider,
      );

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    res.write(`data: ${JSON.stringify({ sources })}\n\n`);

    let fullContent = "";
    for await (const part of stream) {
      const token = part.message?.content || "";
      if (token) {
        fullContent += token;
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    await saveMessage(fullContent);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    if (!res.headersSent) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
    }
    res.write(
      `data: ${JSON.stringify({ error: error.message })}\n\n`,
    );
    res.end();
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user?._id;

    if (!documentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Document ID is required' 
      });
    }

    const session = await ChatSession.findOne({
      user_id: new mongoose.Types.ObjectId(userId),
      $or: [
        { document_id: new mongoose.Types.ObjectId(documentId) },
        { additional_documents: new mongoose.Types.ObjectId(documentId) }
      ]
    });

    if (!session) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const messages = await ChatMessage.find({ session_id: session._id }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages.map(msg => ({
        id: msg._id.toString(),
        role: msg.sender_type,
        text: msg.message_content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
