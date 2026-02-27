"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Sign up a new user
 * POST /api/auth/signup
 */
const signup = async (req, res) => {
    try {
        const { username, password, admin } = req.body;
        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists'
            });
        }
        // Create new user
        const user = new user_model_1.default({
            username,
            password,
            admin: admin || false // Default to false if not provided
        });
        await user.save();
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                _id: user._id,
                username: user.username,
                admin: user.admin
            }
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error
        });
    }
};
exports.signup = signup;
/**
 * Login user and return JWT token
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        // Find user
        const user = await user_model_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Generate JWT token
        const payload = {
            _id: user._id,
            username: user.username,
            admin: user.admin
        };
        const secret = process.env.JWT_SECRET || 'your-fallback-secret-key';
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '7d' });
        return res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                _id: user._id,
                username: user.username,
                admin: user.admin
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during login',
            error
        });
    }
};
exports.login = login;
