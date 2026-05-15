import Document from "../models/document.js";
import DocumentSummary from "../models/documentsummary.js";
import AIService from "../services/aiService.js";

const generateSummary = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { type = "brief" } = req.body;

        const document = await Document.findById(documentId);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        const text = document.extracted_text;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "No extracted text found",
            });
        }


        const existingSummary = await DocumentSummary.findOne({
            document_id: documentId,
            summary_type: type,
        });

        if (existingSummary) {
            return res.json({
                success: true,
                summary: existingSummary,
            });
        }

        let instruction = "";

        switch (type) {
            case "brief":
                instruction =
                    "Create a short summary with important points only.";
                break;

            case "detailed":
                instruction =
                    "Create a detailed summary with explanations.";
                break;

            case "technical":
                instruction =
                    "Create a technical academic summary.";
                break;

            default:
                instruction =
                    "Create a short summary.";
        }

        const prompt = `
${instruction}

Document Content:
${text.slice(0, 10000)}
`;

        const generatedSummary = await AIService.askAI(
            prompt.trim(),
            ""
        );

        const savedSummary = await DocumentSummary.findOneAndUpdate(
            {
                document_id: documentId,
                summary_type: type
            },
            {
                summary_content: generatedSummary
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(201).json({
            success: true,
            summary: savedSummary,
        });

    } catch (error) {
        console.error("Generate Summary Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSummary = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { type = "brief" } = req.query;

        const summary = await DocumentSummary.findOne({
            document_id: documentId,
            summary_type: type,
        });

        if (!summary) {
            return res.status(404).json({
                success: false,
                message: "Summary not found",
            });
        }

        res.json({
            success: true,
            summary,
        });

    } catch (error) {
        console.error("Get Summary Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export {
    generateSummary,
    getSummary
};