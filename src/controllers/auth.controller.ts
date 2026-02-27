import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'

/**
 * Sign up a new user
 * POST /api/auth/signup
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, admin } = req.body
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      })
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Username already exists' 
      })
    }
    
    // Create new user
    const user = new User({
      username,
      password,
      admin: admin || false // Default to false if not provided
    })
    
    await user.save()
    
    return res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        _id: user._id,
        username: user.username,
        admin: user.admin
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error 
    })
  }
}

/**
 * Login user and return JWT token
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      })
    }
    
    // Find user
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      })
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      })
    }
    
    // Generate JWT token
    const payload = {
      _id: user._id,
      username: user.username,
      admin: user.admin
    }
    
    const secret = process.env.JWT_SECRET || 'your-fallback-secret-key'
    const token = jwt.sign(payload, secret, { expiresIn: '7d' })
    
    return res.json({ 
      success: true, 
      message: 'Login successful',
      token: token,
      user: {
        _id: user._id,
        username: user.username,
        admin: user.admin
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error 
    })
  }
}
