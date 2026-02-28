import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

interface AuthUser {
  _id: string
  username: string
  admin: boolean
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
}

const storedUser = localStorage.getItem('user')
const storedToken = localStorage.getItem('token')

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/auth/login', credentials)
      return res.data
    } catch (err: unknown) {
      return rejectWithValue((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed')
    }
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: { username: string; password: string; admin?: boolean }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/auth/signup', data)
      return res.data
    } catch (err: unknown) {
      return rejectWithValue((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Signup failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.token)
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    // Signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(signup.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
