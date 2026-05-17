import uploadService from "../services/uploadService.js";
import DocumentModel from "../models/document.js";
import ChatSession from "../models/chatsession.js";
import ChatMessage from "../models/chatmessage.js";
import mongoose from "mongoose";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { parentId } = req.body;
    const userId = req.user?._id;

    const documentId = await uploadService.processPDF(req.file.path, req.file.originalname, userId);

    if (parentId && mongoose.Types.ObjectId.isValid(parentId)) {
      const uid = new mongoose.Types.ObjectId(userId);
      const pid = new mongoose.Types.ObjectId(parentId);

      let session = await ChatSession.findOne({
        user_id: uid,
        $or: [{ document_id: pid }, { additional_documents: pid }],
      });

      if (!session) {
        session = await ChatSession.create({
          user_id: uid,
          document_id: pid,
          title: "Research Session",
        });
      }

      const alreadyAdded =
        session.document_id.toString() === documentId ||
        session.additional_documents.some((id) => id.toString() === documentId);

      if (!alreadyAdded) {
        session.additional_documents.push(new mongoose.Types.ObjectId(documentId));
        await session.save();

        await DocumentModel.findByIdAndUpdate(documentId, { is_secondary: true });

        await ChatMessage.create({
          session_id: session._id,
          sender_type: "ai",
          message_content: `📎 **File Attached:** ${req.file.originalname}\n\n Successfully indexed.`,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Document uploaded and indexed successfully",
      data: { documentId },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
