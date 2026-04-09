const db = require('../models');

exports.testDb = async (req, res, next) => {
  try {
    await db.sequelize.authenticate();
    res.json({ success: true, message: 'Database connected successfully' });
  } catch (error) {
    next(error);
  }
};

exports.testRelations = (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        User: Object.keys(db.User.associations || {}),
        Document: Object.keys(db.Document.associations || {}),
        Question: Object.keys(db.Question.associations || {}),
        ChatSession: Object.keys(db.ChatSession.associations || {}),
        ChatMessage: Object.keys(db.ChatMessage.associations || {}),
        PointsHistory: Object.keys(db.PointsHistory.associations || {}),
        DocumentChunk: Object.keys(db.DocumentChunk.associations || {}),
        UserSettings: Object.keys(db.UserSettings.associations || {})
      }
    });
  } catch (error) {
    next(error);
  }
};
