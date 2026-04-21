import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPointsHistory extends Document {
  user_id: mongoose.Types.ObjectId;
  type: 'earn' | 'spend';
  reason: string;
  amount: number;
}

const PointsHistorySchema: Schema<IPointsHistory> = new Schema({
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

const PointsHistory: Model<IPointsHistory> = mongoose.model<IPointsHistory>('PointsHistory', PointsHistorySchema);

export default PointsHistory;
