"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const authSlice_1 = __importDefault(require("../features/auth/authSlice"));
const quizSlice_1 = __importDefault(require("../features/quiz/quizSlice"));
const questionSlice_1 = __importDefault(require("../features/questions/questionSlice"));
const userSlice_1 = __importDefault(require("../features/users/userSlice"));
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        auth: authSlice_1.default,
        quiz: quizSlice_1.default,
        questions: questionSlice_1.default,
        users: userSlice_1.default,
    },
});
