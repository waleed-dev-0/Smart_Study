import mongoose, { Schema } from 'mongoose';

const UserSettingsSchema = new Schema({
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

const UserSettings = mongoose.model('UserSettings', UserSettingsSchema);

export default UserSettings;
