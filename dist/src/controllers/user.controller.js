"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Get all users (Admin only)
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users, excluding password field
        const users = await user_model_1.default.find().select('-password');
        return res.json({
            success: true,
            count: users.length,
            users
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error
        });
    }
};
exports.getAllUsers = getAllUsers;
