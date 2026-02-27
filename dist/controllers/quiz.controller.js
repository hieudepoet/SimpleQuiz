"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizWithCapitalQuestions = exports.deleteQuiz = exports.updateQuiz = exports.createQuiz = exports.getQuizById = exports.getAllQuizzes = void 0;
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const question_model_1 = __importDefault(require("../models/question.model"));
const getAllQuizzes = async (_req, res) => {
    try {
        console.log("GET /quizzes");
        const quizzes = await quiz_model_1.default.find().populate('questions');
        return res.json(quizzes);
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
};
exports.getAllQuizzes = getAllQuizzes;
const getQuizById = async (req, res) => {
    try {
        console.log("GET /quizzId");
        const quiz = await quiz_model_1.default.findById(req.params.quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        return res.json(quiz);
    }
    catch (err) {
        return res.status(400).json({ message: 'Invalid quiz ID' });
    }
};
exports.getQuizById = getQuizById;
const createQuiz = async (req, res) => {
    try {
        console.log("POST /quizzes");
        const quiz = new quiz_model_1.default(req.body);
        await quiz.save();
        return res.status(201).json(quiz);
    }
    catch (err) {
        return res.status(400).json({ message: 'Create quiz failed' });
    }
};
exports.createQuiz = createQuiz;
const updateQuiz = async (req, res) => {
    try {
        console.log("PUT /quizzes/" + req.params.quizId);
        const updated = await quiz_model_1.default.findByIdAndUpdate(req.params.quizId, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        return res.json(updated);
    }
    catch (err) {
        return res.status(400).json({ message: 'Update quiz failed' });
    }
};
exports.updateQuiz = updateQuiz;
const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await quiz_model_1.default.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        await question_model_1.default.deleteMany({
            _id: { $in: quiz.questions }
        });
        await quiz_model_1.default.findByIdAndDelete(quizId);
        return res.json({ message: 'Quiz and related questions deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteQuiz = deleteQuiz;
const getQuizWithCapitalQuestions = async (req, res) => {
    try {
        console.log("GET /quizzes/:quizId/populate");
        const { quizId } = req.params;
        const quiz = await quiz_model_1.default.findById(quizId).populate({
            path: 'questions',
            match: {
                text: { $regex: 'capital', $options: 'i' }
            }
        });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        return res.json(quiz);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
exports.getQuizWithCapitalQuestions = getQuizWithCapitalQuestions;
