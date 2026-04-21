import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
  document_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: any;
  correct_answer: string;
  explanation?: string;
}

const QuestionSchema: Schema<IQuestion> = new Schema({
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

const Question: Model<IQuestion> = mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
