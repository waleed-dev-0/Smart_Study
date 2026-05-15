import QuizAttempt from "../models/quizAttempt.js";

export const saveAttempt = async (req, res) => {
  try {
    const currentUserId = req.user?._id;

    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "not logged in" });
    }

    let myAttempt = await QuizAttempt.create({
      user_id: currentUserId,
      document_id: req.body.documentId,
      score: req.body.score,
      total_questions: req.body.totalQuestions,
      difficulty: req.body.difficulty,
      answers: req.body.answers
    });

    res.status(201).json({
      success: true,
      message: "saved",
      data: myAttempt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttempts = async (req, res) => {
  try {
    const historyList = await QuizAttempt.find({ user_id: req.user?._id })
      .populate('document_id', 'title')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      data: historyList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttemptById = async (req, res) => {
  try {
    let singleHistory = await QuizAttempt.findOne({ _id: req.params.id, user_id: req.user?._id })
      .populate('document_id', 'title');

    if (!singleHistory) {
      return res.status(404).json({ success: false, message: "not found" });
    }

    res.status(200).json({
      success: true,
      data: singleHistory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
