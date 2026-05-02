import mongoose, { Schema } from 'mongoose';

const PointsHistorySchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['earn', 'spend'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const PointsHistory = mongoose.model('PointsHistory', PointsHistorySchema);

export default PointsHistory;
