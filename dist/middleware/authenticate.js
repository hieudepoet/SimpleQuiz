"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthor = exports.verifyAdmin = exports.verifyUser = void 0;
const passport_1 = __importDefault(require("passport"));
const question_model_1 = __importDefault(require("../models/question.model"));
/**
 * Middleware to verify JWT token and authenticate user
 * Adds req.user if token is valid, returns 401 if invalid or missing
 */
const verifyUser = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized! Invalid or missing token.'
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.verifyUser = verifyUser;
/**
 * Middleware to verify if authenticated user has admin privileges
 * Must be used after verifyUser middleware
 * Returns 403 if user is not an admin
 */
const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized! User not authenticated.'
        });
    }
    if (req.user.admin !== true) {
        return res.status(403).json({
            success: false,
            message: 'You are not authorized to perform this operation!'
        });
    }
    next();
};
exports.verifyAdmin = verifyAdmin;
/**
 * Middleware to verify if authenticated user is the author of a question
 * Must be used after verifyUser middleware
 * Returns 403 if user is not the author, 404 if question not found
 */
const verifyAuthor = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized! User not authenticated.'
            });
        }
        const questionId = req.params.questionId;
        const question = await question_model_1.default.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        // Compare author ObjectId with user._id
        if (question.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not the author of this question'
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while verifying author',
            error
        });
    }
};
exports.verifyAuthor = verifyAuthor;
