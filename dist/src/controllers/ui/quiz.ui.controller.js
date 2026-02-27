"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeQuestion = exports.addQuestion = exports.addQuestions = exports.remove = exports.update = exports.formEdit = exports.details = exports.create = exports.formCreate = exports.list = void 0;
const axios_1 = __importDefault(require("axios"));
const PORT = process.env.PORT || 3000;
const API_BASE = `http://localhost:${PORT}/api/quizzes`;
const API_QUESTIONS = `http://localhost:${PORT}/api/questions`;
const logError = (err) => {
    if (axios_1.default.isAxiosError(err)) {
        console.error("Axios Error:", err.response?.data || err.message);
    }
    else {
        console.error("Error:", err);
    }
};
const list = async (req, res) => {
    try {
        const response = await axios_1.default.get(API_BASE);
        res.render("quiz/list.ejs", { quizzes: response.data });
    }
    catch (err) {
        logError(err);
        res.render("quiz/list.ejs", { quizzes: [], error: "Failed to fetch quizzes" });
    }
};
exports.list = list;
const formCreate = (_req, res) => {
    res.render("quiz/create.ejs");
};
exports.formCreate = formCreate;
const create = async (req, res) => {
    try {
        await axios_1.default.post(API_BASE, req.body);
        res.redirect("/quizzes");
    }
    catch (err) {
        logError(err);
        res.render("quiz/create.ejs", {
            error: "Failed to create quiz",
            formData: req.body,
        });
    }
};
exports.create = create;
const details = async (req, res) => {
    try {
        const response = await axios_1.default.get(`${API_BASE}/${req.params.id}`);
        res.render("quiz/details.ejs", { quiz: response.data });
    }
    catch (err) {
        logError(err);
        res.redirect("/quizzes");
    }
};
exports.details = details;
const formEdit = async (req, res) => {
    try {
        const [quizRes, questionsRes] = await Promise.all([
            axios_1.default.get(`${API_BASE}/${req.params.id}`),
            axios_1.default.get(API_QUESTIONS),
        ]);
        const quiz = quizRes.data;
        const allQuestions = questionsRes.data;
        // Filter out questions already in the quiz
        const quizQuestionIds = (quiz.questions || []).map((q) => (q._id || q).toString());
        const availableQuestions = allQuestions.filter((q) => !quizQuestionIds.includes(q._id.toString()));
        res.render("quiz/edit.ejs", { quiz, availableQuestions });
    }
    catch (err) {
        logError(err);
        res.redirect("/quizzes");
    }
};
exports.formEdit = formEdit;
const update = async (req, res) => {
    try {
        await axios_1.default.put(`${API_BASE}/${req.params.id}`, req.body);
        res.redirect(`/quizzes/${req.params.id}`);
    }
    catch (err) {
        logError(err);
        res.redirect(`/quizzes/${req.params.id}/edit`);
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await axios_1.default.delete(`${API_BASE}/${req.params.id}`);
        res.redirect("/quizzes");
    }
    catch (err) {
        logError(err);
        res.redirect("/quizzes");
    }
};
exports.remove = remove;
// Method for Batch Creating and Adding NEW Questions
const addQuestions = async (req, res) => {
    try {
        const { id } = req.params;
        let questionsData = req.body.questions;
        // Ensure array format (if it comes as object with keys '0', '1', etc.)
        if (questionsData && typeof questionsData === 'object' && !Array.isArray(questionsData)) {
            questionsData = Object.values(questionsData);
        }
        if (Array.isArray(questionsData)) {
            const formattedQuestions = questionsData.map((q) => ({
                text: q.text,
                options: q.options,
                keywords: [],
                correctAnswerIndex: parseInt(q.correctIndex)
            }));
            // Use the bulk create endpoint
            await axios_1.default.post(`${API_BASE}/${id}/questions`, formattedQuestions);
        }
        res.redirect(`/quizzes/${id}/edit`);
    }
    catch (err) {
        logError(err);
        res.redirect(`/quizzes/${req.params.id}/edit`);
    }
};
exports.addQuestions = addQuestions;
// New Methods for Managing Questions within Quiz
const addQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        // CASE 1: Add Existing Question
        if (req.body.questionId) {
            const { questionId } = req.body;
            // Fetch current quiz
            const quizRes = await axios_1.default.get(`${API_BASE}/${id}`);
            const quiz = quizRes.data;
            const currentQuestionIds = (quiz.questions || []).map((q) => q._id || q);
            if (!currentQuestionIds.includes(questionId)) {
                currentQuestionIds.push(questionId);
                await axios_1.default.put(`${API_BASE}/${id}`, { questions: currentQuestionIds });
            }
        }
        // CASE 2: Create New Question directly in Quiz
        else if (req.body.text) {
            await axios_1.default.post(`${API_BASE}/${id}/question`, {
                text: req.body.text,
                options: req.body.options,
                correctAnswerIndex: parseInt(req.body.correctIndex)
            });
        }
        res.redirect(`/quizzes/${id}/edit`);
    }
    catch (err) {
        logError(err);
        res.redirect(`/quizzes/${req.params.id}/edit`);
    }
};
exports.addQuestion = addQuestion;
const removeQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { questionId } = req.body;
        // Fetch current quiz
        const quizRes = await axios_1.default.get(`${API_BASE}/${id}`);
        const quiz = quizRes.data;
        const currentQuestionIds = (quiz.questions || []).map((q) => (q._id || q).toString());
        const updatedQuestionIds = currentQuestionIds.filter((qId) => qId !== questionId);
        await axios_1.default.put(`${API_BASE}/${id}`, { questions: updatedQuestionIds });
        res.redirect(`/quizzes/${id}/edit`);
    }
    catch (err) {
        logError(err);
        res.redirect(`/quizzes/${req.params.id}/edit`);
    }
};
exports.removeQuestion = removeQuestion;
