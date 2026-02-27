import mongoose, { Schema, Document } from 'mongoose'

export interface IQuestion extends Document {
  text: string
  options: string[]
  keywords: string[]
  correctAnswerIndex: number
  author: mongoose.Types.ObjectId
}

const QuestionSchema: Schema = new Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  keywords: { type: [String], default: [] },
  correctAnswerIndex: { type: Number, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

export default mongoose.models.Question ||
  mongoose.model<IQuestion>('Question', QuestionSchema)
