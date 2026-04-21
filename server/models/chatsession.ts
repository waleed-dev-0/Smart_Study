import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatSession extends Document {
  user_id: mongoose.Types.ObjectId;
  document_id: mongoose.Types.ObjectId;
  title: string;
}

const ChatSessionSchema: Schema<IChatSession> = new Schema({
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
  title: {
    type: String,
    required: true,
    default: 'New Chat Session'
  }
}, {
  timestamps: true
});

const ChatSession: Model<IChatSession> = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);

export default ChatSession;
