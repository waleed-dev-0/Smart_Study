
import mongoose, { Schema } from 'mongoose';

const DocumentSummarySchema = new Schema({
  document_id: {
    type: Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
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
DocumentSummarySchema.index(
    { document_id: 1, summary_type: 1 },
    { unique: true }
);

const DocumentSummary = mongoose.model('DocumentSummary', DocumentSummarySchema);

export default DocumentSummary;