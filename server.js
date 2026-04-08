const express = require('express');
const db = require('./models');

const app = express();
const PORT = 5000;

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Server is running');
});


app.get('/test-db', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ message: 'Database connected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/test-relations', (req, res) => {
  res.json({
    User: Object.keys(db.User.associations || {}),
    Document: Object.keys(db.Document.associations || {}),
    Question: Object.keys(db.Question.associations || {}),
    ChatSession: Object.keys(db.ChatSession.associations || {}),
    ChatMessage: Object.keys(db.ChatMessage.associations || {}),
    PointsHistory: Object.keys(db.PointsHistory.associations || {}),
    DocumentChunk: Object.keys(db.DocumentChunk.associations || {})
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});