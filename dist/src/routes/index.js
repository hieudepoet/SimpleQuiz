"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_routes_1 = __importDefault(require("./quiz.routes"));
const question_routes_1 = __importDefault(require("./question.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/quizzes', quiz_routes_1.default);
router.use('/questions', question_routes_1.default);
exports.default = router;
