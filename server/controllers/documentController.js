import DocumentModel from '../models/document.js';

export const getDocuments = async (req, res) => {
  try {
    const userId = req.user?._id;
    const documents = await DocumentModel.find({ user_id: userId, is_secondary: { $ne: true } }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
