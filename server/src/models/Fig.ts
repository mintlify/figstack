import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const FigSchema = new Schema({
  id: { type: String, required: true, unique: true, default: () => uuidv4() },
  email: { type: String, required: true },
  figFunction: { type: String, required: true },
  input: { type: String, required: true },
  output: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  inputLanguage: { type: String },
  outputLanguage: { type: String },
  source: { type: String },
  feedbackIsPositive: { type: Boolean }
})

const Fig = mongoose.model('Fig', FigSchema, 'figs');

export default Fig;
