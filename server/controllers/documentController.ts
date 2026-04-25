import { Request, Response } from 'express';
import DocumentModel from '../models/document';

export const getDocuments = async (req: any, res: Response) => {
  try {
    const userId = req.user?._id;
    const documents = await DocumentModel.find({ user_id: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: documents
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
