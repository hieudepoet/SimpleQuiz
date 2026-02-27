import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import axiosClient from '../../api/axiosClient'

export interface Question {
  _id: string
  text: string
  options: string[]
  keywords: string[]
  correctAnswerIndex: number
  author: string
}

interface QuestionState {
  questions: Question[]
  loading: boolean
  saving: boolean
  error: string | null
}

const initialState: QuestionState = {
  questions: [],
  loading: false,
  saving: false,
  error: null,
}

export const fetchAllQuestions = createAsyncThunk(
  'question/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/questions')
      return res.data as Question[]
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to fetch questions' : 'Failed')
    }
  }
)

export const createQuestion = createAsyncThunk(
  'question/create',
  async (data: Omit<Question, '_id' | 'author'>, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/questions', data)
      return res.data as Question
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to create question' : 'Failed')
    }
  }
)

export const updateQuestion = createAsyncThunk(
  'question/update',
  async ({ id, data }: { id: string; data: Partial<Omit<Question, '_id' | 'author'>> }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/questions/${id}`, data)
      return res.data as Question
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to update question' : 'Failed')
    }
  }
)

export const deleteStandaloneQuestion = createAsyncThunk(
  'question/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/questions/${id}`)
      return id
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to delete question' : 'Failed')
    }
  }
)

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllQuestions.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(fetchAllQuestions.fulfilled, (state, action) => {
      state.loading = false; state.questions = action.payload
    })
    builder.addCase(fetchAllQuestions.rejected, (state, action) => {
      state.loading = false; state.error = action.payload as string
    })

    builder.addCase(createQuestion.pending, (state) => { state.saving = true; state.error = null })
    builder.addCase(createQuestion.fulfilled, (state, action) => {
      state.saving = false; state.questions.push(action.payload)
    })
    builder.addCase(createQuestion.rejected, (state, action) => {
      state.saving = false; state.error = action.payload as string
    })

    builder.addCase(updateQuestion.pending, (state) => { state.saving = true; state.error = null })
    builder.addCase(updateQuestion.fulfilled, (state, action) => {
      state.saving = false
      const idx = state.questions.findIndex(q => q._id === action.payload._id)
      if (idx !== -1) state.questions[idx] = action.payload
    })
    builder.addCase(updateQuestion.rejected, (state, action) => {
      state.saving = false; state.error = action.payload as string
    })

    builder.addCase(deleteStandaloneQuestion.fulfilled, (state, action) => {
      state.questions = state.questions.filter(q => q._id !== action.payload)
    })
    builder.addCase(deleteStandaloneQuestion.rejected, (state, action) => {
      state.error = action.payload as string
    })
  },
})

export const { clearError } = questionSlice.actions
export default questionSlice.reducer
