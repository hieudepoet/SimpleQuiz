import { Router } from 'express'
import { signup, login } from '../controllers/auth.controller'

const router = Router()

// POST /api/auth/signup - Register new user
router.post('/signup', signup)

// POST /api/auth/login - Login and get JWT token
router.post('/login', login)

export default router
