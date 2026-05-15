export const validateGenerateQuestions = (req, res, next) => {
  const { document_id, count, difficulty, language } = req.body;

  if (!document_id) {
    console.error(`Validation failed: Missing document_id for user ${req.user?._id}`);
    return res.status(400).json({ success: false, message: "Missing required data: document_id" });
  }

  const requestedCount = parseInt(count || 10);
  if (isNaN(requestedCount) || requestedCount <= 0 || requestedCount > 50) {
    console.error(`Validation failed: Invalid count ${count} for user ${req.user?._id}`);
    return res.status(400).json({ success: false, message: "Invalid question count. Must be between 1 and 50." });
  }

  const allowedDifficulties = ['easy', 'medium', 'hard'];
  if (difficulty && !allowedDifficulties.includes(difficulty.toLowerCase())) {
    return res.status(400).json({ success: false, message: "Invalid difficulty level." });
  }


  req.validatedData = {
    documentId: document_id,
    count: requestedCount,
    difficulty: difficulty || 'medium',
    language: language || 'English'
  };

  next();
};
