import { Router } from 'express'
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/question.controller'
import { verifyUser, verifyAuthor } from '../middleware/authenticate'

const router = Router()

// Public routes (GET - anyone can access)
router.get('/', getAllQuestions)
router.get('/:questionId', getQuestionById)

// Protected routes
router.post('/', verifyUser, createQuestion) // Any authenticated user can create
router.put('/:questionId', verifyUser, verifyAuthor, updateQuestion) // Only author can update
router.delete('/:questionId', verifyUser, verifyAuthor, deleteQuestion) // Only author can delete

export default router
