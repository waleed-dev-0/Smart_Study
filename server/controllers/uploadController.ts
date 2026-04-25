import { Request, Response } from 'express';
import uploadService from '../services/uploadService';

export const uploadDocument = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.user?._id;
    const documentId = await uploadService.processPDF(
      req.file.path,
      req.file.originalname,
      userId
    );

    res.status(200).json({
      success: true,
      message: 'Document uploaded and indexed successfully',
      data: { documentId }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
