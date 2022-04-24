import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const PlanSchema = new Schema({
  name: { type: String, required: true },
  lastBilled: { type: Date, required: true },
})

const UserSchema = new Schema({
  userId: { type: String, required: true, unique: true, default: () => uuidv4() },
  email: { type: String, required: true, unique: true },
  isEmailVerified: { type: Boolean, required: true, default: true },
  name: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  profileImg: { type: String, required: false },
  createdAt: { type: Date, required: true, default: Date.now },
  lastLogInAt: { type: Date, required: true, default: Date.now },
  plan: { type: PlanSchema, required: true },
  stripeCustomerId: { type: String },
  githubUsername: { type: String },
})

const User = mongoose.model('User', UserSchema, 'users');

export default User;
