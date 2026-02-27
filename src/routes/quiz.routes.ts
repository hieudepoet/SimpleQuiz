import { Router } from 'express'
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizWithCapitalQuestions,
} from '../controllers/quiz.controller'

import { createQuestionInQuiz, createManyQuestionsInQuiz } from '../controllers/question.controller'
import { verifyUser, verifyAdmin } from '../middleware/authenticate'

const router = Router()

// Public routes (GET - anyone can access)
router.get('/', getAllQuizzes)
router.get('/:quizId', getQuizById)
router.get('/:quizId/populate', getQuizWithCapitalQuestions)

// Protected routes (Admin only)
router.post('/', verifyUser, verifyAdmin, createQuiz)
router.put('/:quizId', verifyUser, verifyAdmin, updateQuiz)
router.delete('/:quizId', verifyUser, verifyAdmin, deleteQuiz)
router.post('/:quizId/question', verifyUser, verifyAdmin, createQuestionInQuiz)
router.post('/:quizId/questions', verifyUser, verifyAdmin, createManyQuestionsInQuiz)

export default router
