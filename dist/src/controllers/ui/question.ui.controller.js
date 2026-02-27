"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromQuiz = exports.addToQuiz = exports.remove = exports.update = exports.formEdit = exports.details = exports.create = exports.formCreate = exports.list = void 0;
const axios_1 = __importDefault(require("axios"));
const PORT = process.env.PORT || 3000;
const API_QUESTIONS = `http://localhost:${PORT}/api/questions`;
const API_QUIZZES = `http://localhost:${PORT}/api/quizzes`;
const logError = (err) => {
    if (axios_1.default.isAxiosError(err)) {
        console.error("Axios Error:", err.response?.status, err.response?.data || err.message);
    }
    else {
        console.error("Error:", err);
    }
};
const list = async (req, res) => {
    try {
        const response = await axios_1.default.get(API_QUESTIONS);
        res.render('questions/list.ejs', { questions: response.data });
    }
    catch (err) {
        logError(err);
        res.render('questions/list.ejs', { questions: [], error: 'Failed to retrieve questions' });
    }
};
exports.list = list;
const formCreate = async (req, res) => {
    try {
        const quizzesRes = await axios_1.default.get(API_QUIZZES);
        res.render('questions/create.ejs', {
            quizzes: quizzesRes.data,
            selectedQuizId: req.query.quizId
        });
    }
    catch (err) {
        res.render('questions/create.ejs', { quizzes: [], selectedQuizId: null });
    }
};
exports.formCreate = formCreate;
const create = async (req, res) => {
    try {
        // Prepare data for API
        const questionData = {
            text: req.body.text,
            options: req.body.options, // Expecting array of strings from form
            keywords: [],
            correctAnswerIndex: parseInt(req.body.correctIndex)
        };
        // Create Question
        const qRes = await axios_1.default.post(API_QUESTIONS, questionData);
        const newQuestion = qRes.data;
        // If Quiz selected, assign it
        if (req.body.quizId) {
            try {
                const quizRes = await axios_1.default.get(`${API_QUIZZES}/${req.body.quizId}`);
                const quiz = quizRes.data;
                const currentQuestionIds = quiz.questions.map((q) => q._id || q);
                await axios_1.default.put(`${API_QUIZZES}/${req.body.quizId}`, {
                    questions: [...currentQuestionIds, newQuestion._id]
                });
            }
            catch (assignErr) {
                console.error("Failed to assign to quiz", assignErr);
            }
        }
        res.redirect('/questions');
    }
    catch (err) {
        logError(err);
        const quizzesRes = await axios_1.default.get(API_QUIZZES).catch(() => ({ data: [] }));
        res.render('questions/create.ejs', {
            error: 'Failed to create question',
            formData: req.body,
            quizzes: quizzesRes.data
        });
    }
};
exports.create = create;
const details = async (req, res) => {
    try {
        const [questionRes, quizzesRes] = await Promise.all([
            axios_1.default.get(`${API_QUESTIONS}/${req.params.id}`),
            axios_1.default.get(API_QUIZZES)
        ]);
        const question = questionRes.data;
        const allQuizzes = quizzesRes.data;
        const questionId = question._id.toString();
        const associatedQuizzes = allQuizzes.filter((q) => {
            const qIds = (q.questions || []).map((qid) => (qid._id || qid).toString());
            return qIds.includes(questionId);
        });
        res.render('questions/details.ejs', { question, associatedQuizzes });
    }
    catch (err) {
        logError(err);
        res.redirect('/questions');
    }
};
exports.details = details;
const formEdit = async (req, res) => {
    try {
        const [questionRes, quizzesRes] = await Promise.all([
            axios_1.default.get(`${API_QUESTIONS}/${req.params.id}`),
            axios_1.default.get(API_QUIZZES)
        ]);
        const question = questionRes.data;
        const allQuizzes = quizzesRes.data;
        // Determine relationships
        // A quiz contains this question if its 'questions' array includes this question ID
        const questionId = question._id.toString();
        const associatedQuizzes = allQuizzes.filter((q) => {
            const qIds = (q.questions || []).map((qid) => (qid._id || qid).toString());
            return qIds.includes(questionId);
        });
        const availableQuizzes = allQuizzes.filter((q) => {
            const qIds = (q.questions || []).map((qid) => (qid._id || qid).toString());
            return !qIds.includes(questionId);
        });
        res.render('questions/edit.ejs', { question, associatedQuizzes, availableQuizzes });
    }
    catch (err) {
        logError(err);
        res.redirect('/questions');
    }
};
exports.formEdit = formEdit;
const update = async (req, res) => {
    try {
        const questionData = {
            text: req.body.text,
            options: req.body.options,
            correctAnswerIndex: parseInt(req.body.correctIndex)
        };
        await axios_1.default.put(`${API_QUESTIONS}/${req.params.id}`, questionData);
        res.redirect(`/questions/${req.params.id}`);
    }
    catch (err) {
        logError(err);
        res.redirect(`/questions/${req.params.id}/edit`);
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await axios_1.default.delete(`${API_QUESTIONS}/${req.params.id}`);
        res.redirect('/questions');
    }
    catch (err) {
        logError(err);
        res.redirect('/questions');
    }
};
exports.remove = remove;
// New Methods for Managing Quiz Membership from Question Side
const addToQuiz = async (req, res) => {
    try {
        const { id } = req.params; // Question ID
        const { quizId } = req.body;
        const quizRes = await axios_1.default.get(`${API_QUIZZES}/${quizId}`);
        const quiz = quizRes.data;
        const currentQuestionIds = (quiz.questions || []).map((q) => q._id || q);
        if (!currentQuestionIds.includes(id)) {
            currentQuestionIds.push(id);
            await axios_1.default.put(`${API_QUIZZES}/${quizId}`, { questions: currentQuestionIds });
        }
        res.redirect(`/questions/${id}/edit`);
    }
    catch (err) {
        logError(err);
        res.redirect(`/questions/${req.params.id}/edit`);
    }
};
exports.addToQuiz = addToQuiz;
const removeFromQuiz = async (req, res) => {
    try {
        const { id } = req.params; // Question ID
        const { quizId } = req.body;
        const quizRes = await axios_1.default.get(`${API_QUIZZES}/${quizId}`);
        const quiz = quizRes.data;
        const currentQuestionIds = (quiz.questions || []).map((q) => (q._id || q).toString());
        const updatedQuestionIds = currentQuestionIds.filter((qid) => qid !== id);
        await axios_1.default.put(`${API_QUIZZES}/${quizId}`, { questions: updatedQuestionIds });
        res.redirect(`/questions/${id}/edit`);
    }
    catch (err) {
        logError(err);
        res.redirect(`/questions/${req.params.id}/edit`);
    }
};
exports.removeFromQuiz = removeFromQuiz;
