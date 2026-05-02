import chatService from '../services/chatService.js';

export const askAI = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
