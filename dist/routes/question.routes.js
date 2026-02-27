"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = require("../controllers/question.controller");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Public routes (GET - anyone can access)
router.get('/', question_controller_1.getAllQuestions);
router.get('/:questionId', question_controller_1.getQuestionById);
// Protected routes
router.post('/', authenticate_1.verifyUser, question_controller_1.createQuestion); // Any authenticated user can create
router.put('/:questionId', authenticate_1.verifyUser, authenticate_1.verifyAuthor, question_controller_1.updateQuestion); // Only author can update
router.delete('/:questionId', authenticate_1.verifyUser, authenticate_1.verifyAuthor, question_controller_1.deleteQuestion); // Only author can delete
exports.default = router;
