import uploadService from "../services/uploadService.js";
import DocumentModel from "../models/document.js";
import ChatSession from "../models/chatsession.js";
import ChatMessage from "../models/chatmessage.js";
import mongoose from "mongoose";

async function generateUniqueTitle(originalName, userId) {
  const match = originalName.match(/^(.+?)(?:\s\((\d+)\))?(\.[^.]+)$/);
  const baseName = match ? match[1] : originalName;
  const ext = match ? match[3] : "";
  const escaped = baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedExt = ext.replace(".", "\\.");

  const existingDocs = await DocumentModel.find({
    user_id: userId,
    title: { $regex: `^${escaped}(?:\\s\\(\\d+\\))?${escapedExt}$` },
  });

  if (existingDocs.length === 0) return originalName;

  let num = 1;
  while (existingDocs.some((d) => d.title === `${baseName} (${num})${ext}`)) {
    num++;
  }
  return `${baseName} (${num})${ext}`;
}

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { parentId, force } = req.body;
    const userId = req.user?._id;

    let title = req.file.originalname;
    if (force === "true") {
      title = await generateUniqueTitle(req.file.originalname, userId);
    }

    const documentId = await uploadService.processPDF(
      req.file.path,
      title,
      userId,
    );

    if (parentId && mongoose.Types.ObjectId.isValid(parentId)) {
      const sessionSearch = {
        user_id: new mongoose.Types.ObjectId(userId),
        $or: [
          { document_id: new mongoose.Types.ObjectId(parentId) },
          { additional_documents: new mongoose.Types.ObjectId(parentId) },
        ],
      };

      let session = await ChatSession.findOne(sessionSearch);

      if (!session) {
        session = await ChatSession.create({
          user_id: new mongoose.Types.ObjectId(userId),
          document_id: new mongoose.Types.ObjectId(parentId),
          title: `Research Session`,
        });
      }

      if (session) {
        const isAlreadyAdded =
          session.document_id.toString() === documentId ||
          session.additional_documents.some(
            (id) => id.toString() === documentId,
          );

        if (!isAlreadyAdded) {
          session.additional_documents.push(
            new mongoose.Types.ObjectId(documentId),
          );
          await session.save();

          await DocumentModel.findByIdAndUpdate(documentId, {
            is_secondary: true,
          });

          await ChatMessage.create({
            session_id: session._id,
            sender_type: "ai",
            message_content: `📎 **File Attached:** ${req.file.originalname}\n\n Successfully indexed.`,
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Document uploaded and indexed successfully",
      data: { documentId },
    });
  } catch (error) {
    if (error.message === "File already exists") {
      return res.status(409).json({
        success: false,
        message: "File already exists",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
