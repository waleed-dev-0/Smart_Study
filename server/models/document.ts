import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  file_path: string;
  file_size_bytes?: number;
  file_format?: string;
  page_count: number;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
}

const DocumentSchema: Schema<IDocument> = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  file_path: {
    type: String,
    required: true
  },
  file_size_bytes: {
    type: Number
  },
  file_format: {
    type: String
  },
  page_count: {
    type: Number,
    default: 0
  },
  processing_status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const DocumentModel: Model<IDocument> = mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;
