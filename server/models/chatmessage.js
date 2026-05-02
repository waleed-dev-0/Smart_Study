import mongoose, { Schema } from 'mongoose';

const ChatMessageSchema = new Schema({
  session_id: {
    type: Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true
  },
  sender_type: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  message_content: {
    type: String,
    required: true
  },
  tokens_used: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

export default ChatMessage;
