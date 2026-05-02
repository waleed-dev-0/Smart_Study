import mongoose, { Schema } from 'mongoose';

const ChatSessionSchema = new Schema({
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

const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);

export default ChatSession;
