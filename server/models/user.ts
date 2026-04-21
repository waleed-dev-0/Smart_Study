import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  full_name: string;
  email: string;
  password_hash: string;
  role: 'student' | 'admin';
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
