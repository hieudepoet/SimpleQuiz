import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import axiosClient from '../../api/axiosClient'

export interface User {
  _id: string
  username: string
  admin: boolean
  createdAt?: string
}

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}

const initialState: UserState = { users: [], loading: false, error: null }

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/users')
      return res.data.users as User[]
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to fetch users' : 'Failed')
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.loading = false; state.users = action.payload
    })
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.loading = false; state.error = action.payload as string
    })
  },
})

export default userSlice.reducer
