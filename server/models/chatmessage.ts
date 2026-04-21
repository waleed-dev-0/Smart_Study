import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatMessage extends Document {
  session_id: mongoose.Types.ObjectId;
  sender_type: 'user' | 'ai';
  message_content: string;
  tokens_used: number;
}

const ChatMessageSchema: Schema<IChatMessage> = new Schema({
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

const ChatMessage: Model<IChatMessage> = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessage;
