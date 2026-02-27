import { Request, Response } from 'express'
import User from '../models/user.model'

/**
 * Get all users (Admin only)
 * GET /api/users
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Fetch all users, excluding password field
    const users = await User.find().select('-password')
    
    return res.json({ 
      success: true, 
      count: users.length,
      users 
    })
  } catch (error) {
    console.error('Get users error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users',
      error 
    })
  }
}
