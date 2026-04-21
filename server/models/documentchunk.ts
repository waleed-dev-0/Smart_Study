import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDocumentChunk extends Document {
  document_id: mongoose.Types.ObjectId;
  chunk_index: number;
  chunk_content: string;
  token_count: number;
  embedding: number[];
}

const DocumentChunkSchema: Schema<IDocumentChunk> = new Schema({
  document_id: {
    type: Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  chunk_index: {
    type: Number,
    required: true
  },
  chunk_content: {
    type: String,
    required: true
  },
  token_count: {
    type: Number,
    default: 0
  },
  embedding: {
    type: [Number],
    default: []
  }
}, {
  timestamps: true
});

const DocumentChunk: Model<IDocumentChunk> = mongoose.model<IDocumentChunk>('DocumentChunk', DocumentChunkSchema);

export default DocumentChunk;
