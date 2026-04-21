import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserSettings extends Document {
  user_id: mongoose.Types.ObjectId;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

const UserSettingsSchema: Schema<IUserSettings> = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'light'
  },
  language: {
    type: String,
    default: 'en'
  }
}, {
  timestamps: true
});

const UserSettings: Model<IUserSettings> = mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);

export default UserSettings;
