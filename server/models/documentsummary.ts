import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDocumentSummary extends Document {
  document_id: mongoose.Types.ObjectId;
  summary_content: string;
  summary_type: 'brief' | 'detailed' | 'technical';
}

const DocumentSummarySchema: Schema<IDocumentSummary> = new Schema({
  document_id: {
    type: Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
    unique: true
  },
  summary_content: {
    type: String,
    required: true
  },
  summary_type: {
    type: String,
    enum: ['brief', 'detailed', 'technical'],
    default: 'brief'
  }
}, {
  timestamps: true
});

const DocumentSummary: Model<IDocumentSummary> = mongoose.model<IDocumentSummary>('DocumentSummary', DocumentSummarySchema);

export default DocumentSummary;
