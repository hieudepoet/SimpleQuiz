import { Router } from 'express'
import { getAllUsers } from '../controllers/user.controller'
import { verifyUser, verifyAdmin } from '../middleware/authenticate'

const router = Router()

// GET /api/users - Get all users (Admin only)
router.get('/', verifyUser, verifyAdmin, getAllUsers)

export default router
