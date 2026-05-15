import mongoose, { Schema } from 'mongoose';

const QuizAttemptSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  document_id: {
    type: Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  total_questions: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    questionText: String,
    options: [String],
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    explanation: String
  }]
}, {
  timestamps: true
});

const QuizAttempt = mongoose.model('QuizAttempt', QuizAttemptSchema);

export default QuizAttempt;
