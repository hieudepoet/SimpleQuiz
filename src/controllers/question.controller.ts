import { Request, Response } from 'express'
import Question from '../models/question.model'
import Quizz from '../models/quiz.model'

export const getAllQuestions = async (_req: Request, res: Response) => {
  try {
    console.log('GET /questions')
    const questions = await Question.find()
    return res.json(questions)
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch questions' })
  }
}

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    console.log('GET /questions/' + req.params.questionId)
    const question = await Question.findById(req.params.questionId)
    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }
    return res.json(question)
  } catch (err) {
    return res.status(400).json({ message: 'Invalid question ID' })
  }
}

export const createQuestion = async (req: Request, res: Response) => {
  try {
    console.log('POST /questions')
    
    // Automatically set author to authenticated user
    const questionData = {
      ...req.body,
      author: req.user?._id
    }
    
    const question = new Question(questionData)
    await question.save()
    return res.status(201).json(question)
  } catch (err) {
    return res.status(400).json({ message: 'Create question failed' })
  }
}

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    console.log('PUT /questionId' + req.params.questionId)
    const updated = await Question.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ message: 'Question not found' })
    }

    return res.json(updated)
  } catch (err) {
    return res.status(400).json({ message: 'Update question failed' })
  }
}

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    console.log('DELETE /questionId' + req.params.questionId)
    const deleted = await Question.findByIdAndDelete(req.params.questionId)
    if (!deleted) {
      return res.status(404).json({ message: 'Question not found' })
    }
    return res.json({ message: 'Question deleted successfully' })
  } catch (err) {
    return res.status(400).json({ message: 'Delete question failed' })
  }
}

export const createQuestionInQuiz = async (
  req: Request,
  res: Response
) => {
  try {
    console.log('POST /quizzes/:quizId/question')
    const { quizId } = req.params
    const { text, options, keywords, correctAnswerIndex } = req.body

    const quiz = await Quizz.findById(quizId)
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    // Automatically set author to authenticated user (admin)
    const question = await Question.create({
      text,
      options,
      keywords,
      correctAnswerIndex,
      author: req.user?._id
    })

    quiz.questions.push(question._id)
    await quiz.save()

    return res.status(201).json(question)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}


export const createManyQuestionsInQuiz = async (
  req: Request,
  res: Response
) => {
  try {
    const { quizId } = req.params
    const questionsData = req.body // array

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return res.status(400).json({ message: 'Questions must be an array' })
    }

    const quiz = await Quizz.findById(quizId)
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    // Add author to each question (authenticated admin)
    const questionsWithAuthor = questionsData.map(q => ({
      ...q,
      author: req.user?._id
    }))

    const questions = await Question.insertMany(questionsWithAuthor)

    const questionIds = questions.map(q => q._id)
    quiz.questions.push(...questionIds)

    await quiz.save()

    res.status(201).json({
      message: 'Questions added to quiz successfully',
      questions
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}
