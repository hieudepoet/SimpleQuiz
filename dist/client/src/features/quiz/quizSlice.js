"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSelectedQuiz = exports.removeQuestionFromQuiz = exports.addExistingQuestionToQuiz = exports.deleteQuestion = exports.addManyQuestionsToQuiz = exports.addQuestionToQuiz = exports.deleteQuiz = exports.updateQuiz = exports.createQuiz = exports.fetchQuizById = exports.fetchQuizzes = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const axios_1 = __importDefault(require("axios"));
const axiosClient_1 = __importDefault(require("../../api/axiosClient"));
const initialState = {
    quizzes: [],
    selectedQuiz: null,
    loading: false,
    error: null,
};
exports.fetchQuizzes = (0, toolkit_1.createAsyncThunk)('quiz/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.get('/quizzes');
        return res.data;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to fetch quizzes' : 'Failed to fetch quizzes');
    }
});
exports.fetchQuizById = (0, toolkit_1.createAsyncThunk)('quiz/fetchById', async (id, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.get(`/quizzes/${id}`);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to fetch quiz' : 'Failed to fetch quiz');
    }
});
exports.createQuiz = (0, toolkit_1.createAsyncThunk)('quiz/create', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.post('/quizzes', data);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to create quiz' : 'Failed to create quiz');
    }
});
exports.updateQuiz = (0, toolkit_1.createAsyncThunk)('quiz/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.put(`/quizzes/${id}`, data);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to update quiz' : 'Failed to update quiz');
    }
});
exports.deleteQuiz = (0, toolkit_1.createAsyncThunk)('quiz/delete', async (id, { rejectWithValue }) => {
    try {
        await axiosClient_1.default.delete(`/quizzes/${id}`);
        return id;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to delete quiz' : 'Failed to delete quiz');
    }
});
exports.addQuestionToQuiz = (0, toolkit_1.createAsyncThunk)('quiz/addQuestion', async ({ quizId, question }, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.post(`/quizzes/${quizId}/question`, question);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to add question' : 'Failed to add question');
    }
});
exports.addManyQuestionsToQuiz = (0, toolkit_1.createAsyncThunk)('quiz/addManyQuestions', async ({ quizId, questions }, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.post(`/quizzes/${quizId}/questions`, questions);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to add questions' : 'Failed to add questions');
    }
});
exports.deleteQuestion = (0, toolkit_1.createAsyncThunk)('quiz/deleteQuestion', async ({ questionId }, { rejectWithValue }) => {
    try {
        await axiosClient_1.default.delete(`/questions/${questionId}`);
        return questionId;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to delete question' : 'Failed to delete question');
    }
});
// Add an EXISTING question (from bank) to quiz — mirrors EJS addQuestion CASE 1
// Uses PUT /quizzes/:id with updated questions array
exports.addExistingQuestionToQuiz = (0, toolkit_1.createAsyncThunk)('quiz/addExisting', async ({ quizId, questionId, currentQuestions }, { rejectWithValue }) => {
    try {
        const currentIds = currentQuestions.map(q => q._id);
        if (currentIds.includes(questionId))
            return rejectWithValue('Question already in quiz');
        const updatedIds = [...currentIds, questionId];
        const res = await axiosClient_1.default.put(`/quizzes/${quizId}`, { questions: updatedIds });
        return res.data;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to add question' : 'Failed to add question');
    }
});
// Remove question from quiz WITHOUT deleting it — mirrors EJS removeQuestion
exports.removeQuestionFromQuiz = (0, toolkit_1.createAsyncThunk)('quiz/removeFromQuiz', async ({ quizId, questionId, currentQuestions }, { rejectWithValue }) => {
    try {
        const updatedIds = currentQuestions.map(q => q._id).filter(id => id !== questionId);
        const res = await axiosClient_1.default.put(`/quizzes/${quizId}`, { questions: updatedIds });
        return { quiz: res.data, questionId };
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to remove question' : 'Failed to remove question');
    }
});
const quizSlice = (0, toolkit_1.createSlice)({
    name: 'quiz',
    initialState,
    reducers: {
        clearSelectedQuiz(state) {
            state.selectedQuiz = null;
        },
    },
    extraReducers: (builder) => {
        // fetchQuizzes
        builder.addCase(exports.fetchQuizzes.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(exports.fetchQuizzes.fulfilled, (state, action) => {
            state.loading = false;
            state.quizzes = action.payload;
        });
        builder.addCase(exports.fetchQuizzes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // fetchQuizById
        builder.addCase(exports.fetchQuizById.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(exports.fetchQuizById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedQuiz = action.payload;
        });
        builder.addCase(exports.fetchQuizById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // createQuiz
        builder.addCase(exports.createQuiz.fulfilled, (state, action) => {
            state.quizzes.push(action.payload);
        });
        // deleteQuiz
        builder.addCase(exports.deleteQuiz.fulfilled, (state, action) => {
            state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
        });
        // deleteQuestion - remove from selectedQuiz
        builder.addCase(exports.deleteQuestion.fulfilled, (state, action) => {
            if (state.selectedQuiz) {
                state.selectedQuiz.questions = state.selectedQuiz.questions.filter((q) => q._id !== action.payload);
            }
        });
    },
});
exports.clearSelectedQuiz = quizSlice.actions.clearSelectedQuiz;
exports.default = quizSlice.reducer;
