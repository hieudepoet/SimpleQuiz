import { Router } from 'express'
import quizRoutes from './quiz.routes'
import questionRoutes from './question.routes'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/quizzes', quizRoutes)
router.use('/questions', questionRoutes)

export default router
