import { QuestionService } from "../services/questionService.js";
import textProcessor from "../services/aiService.js";
import logger from "../utils/logger.js";

// Dependency Injection: Pass the dependency into the service
const questionService = new QuestionService(textProcessor);

export const generateQuestions = async (req, res) => {
  try {
    // Data is pre-validated and sanitized by middleware
    const { documentId, count, difficulty, language } = req.validatedData;
    const studentId = req.user?._id;

    if (!studentId) {
      logger.warn("Unauthorized question generation attempt");
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    logger.info(`Generating ${count} questions for user ${studentId} on doc ${documentId}`);
    
    const savedQuestions = await questionService.generateAndSaveQuestions(
      documentId,
      studentId,
      count,
      difficulty,
      language
    );

    res.status(200).json({
      success: true,
      message: "Questions generated successfully",
      data: savedQuestions
    });

  } catch (error) {
    logger.error(`Error generating questions: ${error.message}\nStack: ${error.stack}`);
    
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: "Document content not found" });
    }
    
    res.status(500).json({ success: false, message: "An internal server error occurred while processing your request." });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const docId = req.params.documentId;
    const studentId = req.user?._id;

    if (!studentId) {
      logger.warn(`Unauthorized getQuestions attempt for doc ${docId}`);
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const savedQuiz = await questionService.getQuestionsByDocument(docId, studentId);

    logger.info(`Successfully retrieved ${savedQuiz.length} questions for user ${studentId}`);
    res.status(200).json({ success: true, data: savedQuiz });

  } catch (error) {
    logger.error(`Error retrieving questions: ${error.message}`);
    res.status(500).json({ success: false, message: "An error occurred while retrieving questions." });
  }
};