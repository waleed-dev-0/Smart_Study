import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema({
  document_id: {
    type: Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question_text: {
    type: String,
    required: true
  },
  question_type: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer'],
    default: 'multiple_choice'
  },
  options: {
    type: Schema.Types.Mixed,
    default: []
  },
  correct_answer: {
    type: String,
    required: true
  },
  explanation: {
    type: String
  }
}, {
  timestamps: true
});

const Question = mongoose.model('Question', QuestionSchema);

export default Question;
