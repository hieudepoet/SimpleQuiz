import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { createQuiz, updateQuiz, fetchQuizById, clearSelectedQuiz } from './quizSlice'

export default function AdminQuizForm() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { selectedQuiz, loading } = useAppSelector((s) => s.quiz)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchQuizById(id))
    }
    return () => { dispatch(clearSelectedQuiz()) }
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (isEdit && selectedQuiz) {
      setTitle(selectedQuiz.title)
      setDescription(selectedQuiz.description)
    }
  }, [selectedQuiz, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit && id) {
        const result = await dispatch(updateQuiz({ id, data: { title, description } }))
        if (updateQuiz.fulfilled.match(result)) navigate(`/quizzes/${id}`)
        else setError((result.payload as string) || 'Failed to update quiz')
      } else {
        const result = await dispatch(createQuiz({ title, description }))
        if (createQuiz.fulfilled.match(result)) {
          const newQuiz = result.payload as { _id: string }
          navigate(`/quizzes/${newQuiz._id}`)
        } else {
          setError((result.payload as string) || 'Failed to create quiz')
        }
      }
    } finally {
      setSaving(false)
    }
  }

  if (isEdit && loading && !selectedQuiz) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
    </div>
  )

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="mb-4">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/quizzes')}>
              <i className="bi bi-arrow-left me-1"></i>Back to Quizzes
            </button>
          </div>
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header border-0 bg-white rounded-top-4 pb-0 pt-4 px-4">
              <h4 className="fw-bold text-primary">
                <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                {isEdit ? 'Edit Quiz' : 'Create New Quiz'}
              </h4>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Quiz Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="e.g. JavaScript Basics"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Brief description of this quiz..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1" disabled={saving}>
                    {saving ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                    ) : isEdit ? (
                      <><i className="bi bi-check-lg me-1"></i>Save Changes</>
                    ) : (
                      <><i className="bi bi-plus-lg me-1"></i>Create Quiz</>
                    )}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/quizzes')}>
                    Cancel
                  </button>
                </div>
              </form>
              {isEdit && (
                <div className="mt-3 text-center">
                  <small className="text-muted">After saving, you can add/remove questions from the quiz detail page.</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
