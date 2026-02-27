import mongoose, { Schema, Document } from 'mongoose'

export interface IQuiz extends Document {
  title: string
  description: string
  questions: mongoose.Types.ObjectId[]
}

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: String,
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
})

export default mongoose.models.Quiz ||
  mongoose.model<IQuiz>('Quiz', QuizSchema)
