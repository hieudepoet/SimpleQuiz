import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import Navbar from './components/Navbar'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import AuthPage from './features/auth/AuthPage'
import QuizListPage from './features/quiz/QuizListPage'
import TakeQuizPage from './features/quiz/TakeQuizPage'
import QuizDetailPage from './features/quiz/QuizDetailPage'
import AdminQuizForm from './features/quiz/AdminQuizForm'
import QuestionsPage from './features/questions/QuestionsPage'
import UsersPage from './features/users/UsersPage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        {children}
      </main>
      <footer className="py-3 text-center text-muted border-top" style={{ background: '#fff' }}>
        <small>© 2024 QuizMaster · Built with React + Redux + Express</small>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Protected routes — any logged-in user */}
          <Route path="/quizzes" element={
            <ProtectedRoute><Layout><QuizListPage /></Layout></ProtectedRoute>
          } />
          <Route path="/quizzes/:id/take" element={
            <ProtectedRoute><Layout><TakeQuizPage /></Layout></ProtectedRoute>
          } />
          <Route path="/quizzes/:id" element={
            <ProtectedRoute><Layout><QuizDetailPage /></Layout></ProtectedRoute>
          } />

          {/* Questions Bank — any logged-in user can view/create; author can edit/delete */}
          <Route path="/questions" element={
            <ProtectedRoute><Layout><QuestionsPage /></Layout></ProtectedRoute>
          } />

          {/* Admin-only routes */}
          <Route path="/admin/quizzes/new" element={
            <AdminRoute><Layout><AdminQuizForm /></Layout></AdminRoute>
          } />
          <Route path="/admin/quizzes/:id/edit" element={
            <AdminRoute><Layout><AdminQuizForm /></Layout></AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute><Layout><UsersPage /></Layout></AdminRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/quizzes" replace />} />
          <Route path="*" element={<Navigate to="/quizzes" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
