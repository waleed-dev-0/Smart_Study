import mongoose, { Schema } from 'mongoose';

const DocumentSchema = new Schema({
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
  },
  is_secondary: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const DocumentModel = mongoose.model('Document', DocumentSchema);

export default DocumentModel;
