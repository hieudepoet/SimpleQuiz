import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchQuizzes, deleteQuiz } from './quizSlice'

export default function QuizListPage() {
  const dispatch = useAppDispatch()
  const { quizzes, loading, error } = useAppSelector((s) => s.quiz)
  const { user } = useAppSelector((s) => s.auth)

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete quiz "${title}"?`)) return
    dispatch(deleteQuiz(id))
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-1">
            <i className="bi bi-collection me-2"></i>Quizzes
          </h2>
          <p className="text-muted mb-0">
            {user?.admin ? 'Manage quizzes below.' : 'Select a quiz to start.'}
          </p>
        </div>
        {user?.admin && (
          <Link to="/admin/quizzes/new" className="btn btn-success">
            <i className="bi bi-plus-lg me-1"></i>New Quiz
          </Link>
        )}
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
      )}

      {error && <div className="alert alert-danger"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}

      {!loading && quizzes.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <p className="text-muted mt-3 fs-5">No quizzes yet. {user?.admin && 'Create one!'}</p>
        </div>
      )}

      <div className="row g-4">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm" style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div className="card-body d-flex flex-column p-4">
                <div className="d-flex align-items-start mb-2">
                  <div className="rounded-3 p-2 me-3" style={{ background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)' }}>
                    <i className="bi bi-journal-text text-white fs-5"></i>
                  </div>
                  <h5 className="card-title fw-bold mb-0 flex-grow-1">{quiz.title}</h5>
                </div>
                <p className="card-text text-muted flex-grow-1 small">
                  {quiz.description ? quiz.description.substring(0, 100) : 'No description'}
                </p>
                <div className="mb-3">
                  <span className="badge bg-light text-dark">
                    <i className="bi bi-question-circle me-1"></i>
                    {quiz.questions?.length ?? 0} questions
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/quizzes/${quiz._id}`} className="btn btn-primary btn-sm flex-grow-1">
                    {user?.admin
                      ? <><i className="bi bi-gear me-1"></i>Manage</>
                      : <><i className="bi bi-play-fill me-1"></i>Take Quiz</>}
                  </Link>
                  {user?.admin && (
                    <>
                      <Link to={`/admin/quizzes/${quiz._id}/edit`} className="btn btn-outline-warning btn-sm">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(quiz._id, quiz.title)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
