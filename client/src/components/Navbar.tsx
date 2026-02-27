import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAppSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname.startsWith(path) ? 'active text-white' : ''

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(90deg,#1e3a8a,#3b82f6)' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="bi bi-mortarboard-fill me-2"></i>QuizMaster
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/quizzes')}`} to="/quizzes">
                    <i className="bi bi-collection me-1"></i>Quizzes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/questions')}`} to="/questions">
                    <i className="bi bi-question-diamond me-1"></i>Questions
                  </Link>
                </li>
                {user.admin && (
                  <>
                    <li className="nav-item">
                      <Link className={`nav-link ${isActive('/admin/quizzes/new')}`} to="/admin/quizzes/new">
                        <i className="bi bi-plus-circle me-1"></i>New Quiz
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`nav-link ${isActive('/admin/users')}`} to="/admin/users">
                        <i className="bi bi-people me-1"></i>Users
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <span className="nav-link text-warning fw-semibold">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.username}
                    {user.admin && <span className="badge bg-warning text-dark ms-1">Admin</span>}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm" to="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
