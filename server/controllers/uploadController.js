import uploadService from '../services/uploadService.js';

export const uploadDocument = async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { parentId } = req.body;
    const userId = req.user?._id;
    const documentId = await uploadService.processPDF(
      req.file.path,
      req.file.originalname,
      userId
    );

    if (parentId && mongoose.Types.ObjectId.isValid(parentId)) {
      const ChatSession = (await import('../models/chatsession.js')).default;
      const sessionSearch = {
        user_id: new mongoose.Types.ObjectId(userId),
        $or: [
          { document_id: new mongoose.Types.ObjectId(parentId) },
          { additional_documents: new mongoose.Types.ObjectId(parentId) }
        ]
      };

      let session = await ChatSession.findOne(sessionSearch);

      if (!session) {
        session = await ChatSession.create({
          user_id: new mongoose.Types.ObjectId(userId),
          document_id: new mongoose.Types.ObjectId(parentId),
          title: `Research Session`
        });
      }

      if (session) {
        const isAlreadyAdded = session.document_id.toString() === documentId || 
                               session.additional_documents.some(id => id.toString() === documentId);
        
        if (!isAlreadyAdded) {
          session.additional_documents.push(new mongoose.Types.ObjectId(documentId));
          await session.save();

          const DocumentModel = (await import('../models/document.js')).default;
          await DocumentModel.findByIdAndUpdate(documentId, { is_secondary: true });

          const ChatMessage = (await import('../models/chatmessage.js')).default;
          await ChatMessage.create({
            session_id: session._id,
            sender_type: 'ai',
            message_content: `📎 **File Attached:** ${req.file.originalname}\n\nI have successfully indexed this document and included it in our current research session. You can now inquire about its content.`
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Document uploaded and indexed successfully',
      data: { documentId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
