import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import quizReducer from '../features/quiz/quizSlice'
import questionReducer from '../features/questions/questionSlice'
import userReducer from '../features/users/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    questions: questionReducer,
    users: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
