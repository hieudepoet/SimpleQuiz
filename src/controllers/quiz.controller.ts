import { Request, Response } from 'express'
import Quiz from '../models/quiz.model'
import Question from '../models/question.model'

export const getAllQuizzes = async (_req: Request, res: Response) => {
  try {
    console.log("GET /quizzes")
    const quizzes = await Quiz.find().populate('questions')
    return res.json(quizzes)
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch quizzes' })
  }
}

export const getQuizById = async (req: Request, res: Response) => {
  try {
    console.log("GET /quizzId")
    const quiz = await Quiz.findById(req.params.quizId).populate('questions')
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }
    return res.json(quiz)
  } catch (err) {
    return res.status(400).json({ message: 'Invalid quiz ID' })
  }
}

export const createQuiz = async (req: Request, res: Response) => {
  try {
    console.log("POST /quizzes")
    const quiz = new Quiz(req.body)
    await quiz.save()
    return res.status(201).json(quiz)
  } catch (err) {
    return res.status(400).json({ message: 'Create quiz failed' })
  }
}

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    console.log("PUT /quizzes/" + req.params.quizId)
    const updated = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    return res.json(updated)
  } catch (err) {
    return res.status(400).json({ message: 'Update quiz failed' })
  }
}

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params

    const quiz = await Quiz.findById(quizId)

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    await Question.deleteMany({
      _id: { $in: quiz.questions }
    })
  
    await Quiz.findByIdAndDelete(quizId)

    return res.json({ message: 'Quiz and related questions deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

export const getQuizWithCapitalQuestions = async (req: Request, res: Response) => {
  try {
    console.log("GET /quizzes/:quizId/populate")
    const { quizId } = req.params

    const quiz = await Quiz.findById(quizId).populate({
      path: 'questions',
      match: {
        text: { $regex: 'capital', $options: 'i' }
      }
    })

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    return res.json(quiz)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}
