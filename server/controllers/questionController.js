import Question from "../models/question.js";
import questionService from "../services/questionService.js";


export const generateQuestions = async (req, res) => {
  try {
    const { document_id, text, count = 5 } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID is missing"
      });
    }

    if (!document_id || !text) {
      return res.status(400).json({
        success: false,
        message: "Missing data: document_id or text is required"
      });
    }

    // Limit count to maximum 20 to avoid exceeding processing limits
    const numQuestions = Math.min(Math.max(parseInt(count) || 5, 1), 20);

    const questions = await questionService.extractQuestionsFromText(text, numQuestions);

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No questions could be generated from the provided text"
      });
    }


    const validQuestions = questions.filter(
      (q) => q.question_text && q.correct_answer && Array.isArray(q.options)
    );

    if (validQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Generated questions were invalid or missing required fields"
      });
    }

    const saved = await Question.insertMany(
      validQuestions.map((q) => ({
        document_id,
        user_id: userId,
        question_text: q.question_text,
        question_type: "multiple_choice",
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || ""
      }))
    );

    res.status(200).json({
      success: true,
      message: "Questions created",
      data: saved
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getQuestions = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID is missing"
      });
    }

    const questions = await Question.find({
      document_id: documentId,
      user_id: userId
    });

    res.status(200).json({
      success: true,
      data: questions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};