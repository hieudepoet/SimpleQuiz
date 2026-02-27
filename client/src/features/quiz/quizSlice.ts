import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import axiosClient from '../../api/axiosClient'

export interface Question {
  _id: string
  text: string
  options: string[]
  correctAnswerIndex: number
  keywords: string[]
  author?: string
}

export interface Quiz {
  _id: string
  title: string
  description: string
  questions: Question[]
}

interface QuizState {
  quizzes: Quiz[]
  selectedQuiz: Quiz | null
  loading: boolean
  error: string | null
}

const initialState: QuizState = {
  quizzes: [],
  selectedQuiz: null,
  loading: false,
  error: null,
}

export const fetchQuizzes = createAsyncThunk('quiz/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get('/quizzes')
    return res.data
  } catch (err: unknown) {
    return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to fetch quizzes' : 'Failed to fetch quizzes')
  }
})

export const fetchQuizById = createAsyncThunk('quiz/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/quizzes/${id}`)
    return res.data
  } catch (err: unknown) {
    return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to fetch quiz' : 'Failed to fetch quiz')
  }
})

export const createQuiz = createAsyncThunk(
  'quiz/create',
  async (data: { title: string; description: string }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/quizzes', data)
      return res.data
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to create quiz' : 'Failed to create quiz')
    }
  }
)

export const updateQuiz = createAsyncThunk(
  'quiz/update',
  async ({ id, data }: { id: string; data: Partial<Quiz> }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/quizzes/${id}`, data)
      return res.data
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to update quiz' : 'Failed to update quiz')
    }
  }
)

export const deleteQuiz = createAsyncThunk('quiz/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/quizzes/${id}`)
    return id
  } catch (err: unknown) {
    return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to delete quiz' : 'Failed to delete quiz')
  }
})

export const addQuestionToQuiz = createAsyncThunk(
  'quiz/addQuestion',
  async (
    { quizId, question }: { quizId: string; question: Omit<Question, '_id' | 'author'> },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post(`/quizzes/${quizId}/question`, question)
      return res.data
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to add question' : 'Failed to add question')
    }
  }
)

export const addManyQuestionsToQuiz = createAsyncThunk(
  'quiz/addManyQuestions',
  async (
    { quizId, questions }: { quizId: string; questions: Omit<Question, '_id' | 'author'>[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post(`/quizzes/${quizId}/questions`, questions)
      return res.data
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to add questions' : 'Failed to add questions')
    }
  }
)

export const deleteQuestion = createAsyncThunk(
  'quiz/deleteQuestion',
  async ({ questionId }: { questionId: string }, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/questions/${questionId}`)
      return questionId
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to delete question' : 'Failed to delete question')
    }
  }
)

// Add an EXISTING question (from bank) to quiz — mirrors EJS addQuestion CASE 1
// Uses PUT /quizzes/:id with updated questions array
export const addExistingQuestionToQuiz = createAsyncThunk(
  'quiz/addExisting',
  async ({ quizId, questionId, currentQuestions }: { quizId: string; questionId: string; currentQuestions: Question[] }, { rejectWithValue }) => {
    try {
      const currentIds = currentQuestions.map(q => q._id)
      if (currentIds.includes(questionId)) return rejectWithValue('Question already in quiz')
      const updatedIds = [...currentIds, questionId]
      const res = await axiosClient.put(`/quizzes/${quizId}`, { questions: updatedIds })
      return res.data
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to add question' : 'Failed to add question')
    }
  }
)

// Remove question from quiz WITHOUT deleting it — mirrors EJS removeQuestion
export const removeQuestionFromQuiz = createAsyncThunk(
  'quiz/removeFromQuiz',
  async ({ quizId, questionId, currentQuestions }: { quizId: string; questionId: string; currentQuestions: Question[] }, { rejectWithValue }) => {
    try {
      const updatedIds = currentQuestions.map(q => q._id).filter(id => id !== questionId)
      const res = await axiosClient.put(`/quizzes/${quizId}`, { questions: updatedIds })
      return { quiz: res.data, questionId }
    } catch (err: unknown) {
      return rejectWithValue(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to remove question' : 'Failed to remove question')
    }
  }
)

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearSelectedQuiz(state) {
      state.selectedQuiz = null
    },
  },
  extraReducers: (builder) => {
    // fetchQuizzes
    builder.addCase(fetchQuizzes.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(fetchQuizzes.fulfilled, (state, action) => {
      state.loading = false
      state.quizzes = action.payload
    })
    builder.addCase(fetchQuizzes.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    // fetchQuizById
    builder.addCase(fetchQuizById.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(fetchQuizById.fulfilled, (state, action) => {
      state.loading = false
      state.selectedQuiz = action.payload
    })
    builder.addCase(fetchQuizById.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    // createQuiz
    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.quizzes.push(action.payload)
    })
    // deleteQuiz
    builder.addCase(deleteQuiz.fulfilled, (state, action) => {
      state.quizzes = state.quizzes.filter((q) => q._id !== action.payload)
    })
    // deleteQuestion - remove from selectedQuiz
    builder.addCase(deleteQuestion.fulfilled, (state, action) => {
      if (state.selectedQuiz) {
        state.selectedQuiz.questions = state.selectedQuiz.questions.filter(
          (q) => q._id !== action.payload
        )
      }
    })
  },
})

export const { clearSelectedQuiz } = quizSlice.actions
export default quizSlice.reducer
