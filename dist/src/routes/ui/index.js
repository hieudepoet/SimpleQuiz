"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_ui_routes_1 = __importDefault(require("./quiz.ui.routes"));
const question_ui_routes_1 = __importDefault(require("./question.ui.routes"));
const router = (0, express_1.Router)();
// Home page
router.get('/', (req, res) => {
    res.render('index'); // Renders index.hbs using default engine
});
router.use('/quizzes', quiz_ui_routes_1.default);
router.use('/questions', question_ui_routes_1.default);
exports.default = router;
