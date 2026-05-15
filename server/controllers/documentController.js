import DocumentModel from '../models/document.js';
import DocumentChunk from '../models/documentchunk.js';
import DocumentSummary from '../models/documentsummary.js';
import ChatSession from '../models/chatsession.js';
import ChatMessage from '../models/chatmessage.js';
import fs from 'fs';


const getDocuments = async (req, res) => {
    try {
        const userId = req.user._id;

        const documents = await DocumentModel.find({ user_id: userId, is_secondary: { $ne: true } }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: documents
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const deleteDocument = async (req, res) => {
    try {
        const userId = req.user?._id;
        const docId = req.params.id;

        const document = await DocumentModel.findOne({
            user_id: userId,
            _id: docId
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }


        const filePath = document?.file_path;

        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }


        await DocumentChunk.deleteMany({
            document_id: docId
        });


        await DocumentSummary.deleteOne({
            document_id: docId
        });


        const sessions = await ChatSession.find({
            $or: [
                { document_id: docId },
                { additional_documents: docId }
            ]
        });

        const sessionIds = sessions.map(session => session._id);


        await ChatMessage.deleteMany({
            session_id: { $in: sessionIds }
        });

        await ChatSession.deleteMany({
            document_id: docId
        });

        await DocumentModel.deleteOne({
            _id: docId,
            user_id: userId
        });

        res.status(200).json({
            success: true,
            message: "Document deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export {
    deleteDocument,
    getDocuments
}