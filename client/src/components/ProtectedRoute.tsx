import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

interface Props { children: React.ReactNode }

export const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAppSelector((s) => s.auth)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export const AdminRoute = ({ children }: Props) => {
  const { user } = useAppSelector((s) => s.auth)
  if (!user) return <Navigate to="/login" replace />
  if (!user.admin) return <Navigate to="/quizzes" replace />
  return <>{children}</>
}
