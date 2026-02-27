"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManyQuestionsInQuiz = exports.createQuestionInQuiz = exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestionById = exports.getAllQuestions = void 0;
const question_model_1 = __importDefault(require("../models/question.model"));
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const getAllQuestions = async (_req, res) => {
    try {
        console.log('GET /questions');
        const questions = await question_model_1.default.find();
        return res.json(questions);
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to fetch questions' });
    }
};
exports.getAllQuestions = getAllQuestions;
const getQuestionById = async (req, res) => {
    try {
        console.log('GET /questions/' + req.params.questionId);
        const question = await question_model_1.default.findById(req.params.questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        return res.json(question);
    }
    catch (err) {
        return res.status(400).json({ message: 'Invalid question ID' });
    }
};
exports.getQuestionById = getQuestionById;
const createQuestion = async (req, res) => {
    try {
        console.log('POST /questions');
        // Automatically set author to authenticated user
        const questionData = {
            ...req.body,
            author: req.user?._id
        };
        const question = new question_model_1.default(questionData);
        await question.save();
        return res.status(201).json(question);
    }
    catch (err) {
        return res.status(400).json({ message: 'Create question failed' });
    }
};
exports.createQuestion = createQuestion;
const updateQuestion = async (req, res) => {
    try {
        console.log('PUT /questionId' + req.params.questionId);
        const updated = await question_model_1.default.findByIdAndUpdate(req.params.questionId, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Question not found' });
        }
        return res.json(updated);
    }
    catch (err) {
        return res.status(400).json({ message: 'Update question failed' });
    }
};
exports.updateQuestion = updateQuestion;
const deleteQuestion = async (req, res) => {
    try {
        console.log('DELETE /questionId' + req.params.questionId);
        const deleted = await question_model_1.default.findByIdAndDelete(req.params.questionId);
        if (!deleted) {
            return res.status(404).json({ message: 'Question not found' });
        }
        return res.json({ message: 'Question deleted successfully' });
    }
    catch (err) {
        return res.status(400).json({ message: 'Delete question failed' });
    }
};
exports.deleteQuestion = deleteQuestion;
const createQuestionInQuiz = async (req, res) => {
    try {
        console.log('POST /quizzes/:quizId/question');
        const { quizId } = req.params;
        const { text, options, keywords, correctAnswerIndex } = req.body;
        const quiz = await quiz_model_1.default.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Automatically set author to authenticated user (admin)
        const question = await question_model_1.default.create({
            text,
            options,
            keywords,
            correctAnswerIndex,
            author: req.user?._id
        });
        quiz.questions.push(question._id);
        await quiz.save();
        return res.status(201).json(question);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
exports.createQuestionInQuiz = createQuestionInQuiz;
const createManyQuestionsInQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const questionsData = req.body; // array
        if (!Array.isArray(questionsData) || questionsData.length === 0) {
            return res.status(400).json({ message: 'Questions must be an array' });
        }
        const quiz = await quiz_model_1.default.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Add author to each question (authenticated admin)
        const questionsWithAuthor = questionsData.map(q => ({
            ...q,
            author: req.user?._id
        }));
        const questions = await question_model_1.default.insertMany(questionsWithAuthor);
        const questionIds = questions.map(q => q._id);
        quiz.questions.push(...questionIds);
        await quiz.save();
        res.status(201).json({
            message: 'Questions added to quiz successfully',
            questions
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createManyQuestionsInQuiz = createManyQuestionsInQuiz;
