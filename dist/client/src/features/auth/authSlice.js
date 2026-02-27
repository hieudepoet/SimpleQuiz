"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearError = exports.logout = exports.signup = exports.login = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const axiosClient_1 = __importDefault(require("../../api/axiosClient"));
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');
const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,
};
exports.login = (0, toolkit_1.createAsyncThunk)('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.post('/auth/login', credentials);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
});
exports.signup = (0, toolkit_1.createAsyncThunk)('auth/signup', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.post('/auth/signup', data);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
});
const authSlice = (0, toolkit_1.createSlice)({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(exports.login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(exports.login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        });
        builder.addCase(exports.login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // Signup
        builder.addCase(exports.signup.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(exports.signup.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(exports.signup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
_a = authSlice.actions, exports.logout = _a.logout, exports.clearError = _a.clearError;
exports.default = authSlice.reducer;
