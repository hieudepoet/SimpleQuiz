"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearError = exports.deleteStandaloneQuestion = exports.updateQuestion = exports.createQuestion = exports.fetchAllQuestions = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const axios_1 = __importDefault(require("axios"));
const axiosClient_1 = __importDefault(require("../../api/axiosClient"));
const initialState = {
    questions: [],
    loading: false,
    saving: false,
    error: null,
};
exports.fetchAllQuestions = (0, toolkit_1.createAsyncThunk)('question/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.get('/questions');
        return res.data;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to fetch questions' : 'Failed');
    }
});
exports.createQuestion = (0, toolkit_1.createAsyncThunk)('question/create', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.post('/questions', data);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to create question' : 'Failed');
    }
});
exports.updateQuestion = (0, toolkit_1.createAsyncThunk)('question/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.put(`/questions/${id}`, data);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to update question' : 'Failed');
    }
});
exports.deleteStandaloneQuestion = (0, toolkit_1.createAsyncThunk)('question/delete', async (id, { rejectWithValue }) => {
    try {
        await axiosClient_1.default.delete(`/questions/${id}`);
        return id;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to delete question' : 'Failed');
    }
});
const questionSlice = (0, toolkit_1.createSlice)({
    name: 'question',
    initialState,
    reducers: {
        clearError(state) { state.error = null; },
    },
    extraReducers: (builder) => {
        builder.addCase(exports.fetchAllQuestions.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(exports.fetchAllQuestions.fulfilled, (state, action) => {
            state.loading = false;
            state.questions = action.payload;
        });
        builder.addCase(exports.fetchAllQuestions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(exports.createQuestion.pending, (state) => { state.saving = true; state.error = null; });
        builder.addCase(exports.createQuestion.fulfilled, (state, action) => {
            state.saving = false;
            state.questions.push(action.payload);
        });
        builder.addCase(exports.createQuestion.rejected, (state, action) => {
            state.saving = false;
            state.error = action.payload;
        });
        builder.addCase(exports.updateQuestion.pending, (state) => { state.saving = true; state.error = null; });
        builder.addCase(exports.updateQuestion.fulfilled, (state, action) => {
            state.saving = false;
            const idx = state.questions.findIndex(q => q._id === action.payload._id);
            if (idx !== -1)
                state.questions[idx] = action.payload;
        });
        builder.addCase(exports.updateQuestion.rejected, (state, action) => {
            state.saving = false;
            state.error = action.payload;
        });
        builder.addCase(exports.deleteStandaloneQuestion.fulfilled, (state, action) => {
            state.questions = state.questions.filter(q => q._id !== action.payload);
        });
        builder.addCase(exports.deleteStandaloneQuestion.rejected, (state, action) => {
            state.error = action.payload;
        });
    },
});
exports.clearError = questionSlice.actions.clearError;
exports.default = questionSlice.reducer;
