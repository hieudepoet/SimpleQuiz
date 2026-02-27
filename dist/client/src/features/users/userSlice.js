"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllUsers = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const axios_1 = __importDefault(require("axios"));
const axiosClient_1 = __importDefault(require("../../api/axiosClient"));
const initialState = { users: [], loading: false, error: null };
exports.fetchAllUsers = (0, toolkit_1.createAsyncThunk)('users/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosClient_1.default.get('/users');
        return res.data.users;
    }
    catch (err) {
        return rejectWithValue(axios_1.default.isAxiosError(err) ? err.response?.data?.message || 'Failed to fetch users' : 'Failed');
    }
});
const userSlice = (0, toolkit_1.createSlice)({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(exports.fetchAllUsers.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(exports.fetchAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        });
        builder.addCase(exports.fetchAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
exports.default = userSlice.reducer;
