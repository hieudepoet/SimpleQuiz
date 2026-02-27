"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_controller_1 = require("../controllers/quiz.controller");
const question_controller_1 = require("../controllers/question.controller");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Public routes (GET - anyone can access)
router.get('/', quiz_controller_1.getAllQuizzes);
router.get('/:quizId', quiz_controller_1.getQuizById);
router.get('/:quizId/populate', quiz_controller_1.getQuizWithCapitalQuestions);
// Protected routes (Admin only)
router.post('/', authenticate_1.verifyUser, authenticate_1.verifyAdmin, quiz_controller_1.createQuiz);
router.put('/:quizId', authenticate_1.verifyUser, authenticate_1.verifyAdmin, quiz_controller_1.updateQuiz);
router.delete('/:quizId', authenticate_1.verifyUser, authenticate_1.verifyAdmin, quiz_controller_1.deleteQuiz);
router.post('/:quizId/question', authenticate_1.verifyUser, authenticate_1.verifyAdmin, question_controller_1.createQuestionInQuiz);
router.post('/:quizId/questions', authenticate_1.verifyUser, authenticate_1.verifyAdmin, question_controller_1.createManyQuestionsInQuiz);
exports.default = router;
