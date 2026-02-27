import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Question from '../models/question.model'

// Define JWT payload interface
interface JwtPayload {
  _id: string
  username: string
  admin: boolean
}

// Extend Express types to include user
declare global {
  namespace Express {
    interface User {
      _id: string
      username: string
      admin: boolean
    }
    
    interface Request {
      user?: User
    }
  }
}

/**
 * Middleware to verify JWT token and authenticate user
 * Adds req.user if token is valid, returns 401 if invalid or missing
 */
export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized! Invalid or missing token.' 
      })
    }
    
    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7)
    
    // Verify token
    const secret = process.env.JWT_SECRET || 'your-fallback-secret-key'
    const decoded = jwt.verify(token, secret) as JwtPayload
    
    // Add user to request
    req.user = {
      _id: decoded._id,
      username: decoded.username,
      admin: decoded.admin
    }
    
    next()
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized! Invalid or missing token.' 
    })
  }
}

/**
 * Middleware to verify if authenticated user has admin privileges
 * Must be used after verifyUser middleware
 * Returns 403 if user is not an admin
 */
export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized! User not authenticated.' 
    })
  }
  
  if (req.user.admin !== true) {
    return res.status(403).json({ 
      success: false, 
      message: 'You are not authorized to perform this operation!' 
    })
  }
  
  next()
}

/**
 * Middleware to verify if authenticated user is the author of a question
 * Must be used after verifyUser middleware
 * Returns 403 if user is not the author, 404 if question not found
 */
export const verifyAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized! User not authenticated.' 
      })
    }
    
    const questionId = req.params.questionId
    const question = await Question.findById(questionId)
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Question not found' 
      })
    }
    
    // Compare author ObjectId with user._id
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not the author of this question' 
      })
    }
    
    next()
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while verifying author',
      error 
    })
  }
}
