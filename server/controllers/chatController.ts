import { Request, Response } from 'express';
import chatService from '../services/chatService';

export const askAI = async (req: any, res: Response) => {
  try {
    const { query, documentId, provider, model } = req.body;
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
      model
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
