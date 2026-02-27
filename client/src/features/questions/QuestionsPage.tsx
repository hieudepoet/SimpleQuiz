import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  fetchAllQuestions,
  createQuestion,
  updateQuestion,
  deleteStandaloneQuestion,
  clearError,
  type Question,
} from './questionSlice'
import { fetchQuizzes, addExistingQuestionToQuiz, removeQuestionFromQuiz } from '../quiz/quizSlice'
import type { Quiz } from '../quiz/quizSlice'

const EMPTY_FORM = { text: '', options: ['', '', '', ''], correctAnswerIndex: 0, keywords: '' }

export default function QuestionsPage() {
  const dispatch = useAppDispatch()
  const { questions, loading, saving, error } = useAppSelector((s) => s.questions)
  const { quizzes } = useAppSelector((s) => s.quiz)
  const { user } = useAppSelector((s) => s.auth)

  const [showForm, setShowForm] = useState(false)
  const [editingQ, setEditingQ] = useState<Question | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [successMsg, setSuccessMsg] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  // Which question's "quiz sidebar" is expanded
  const [expandedSidebar, setExpandedSidebar] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchAllQuestions())
    dispatch(fetchQuizzes())   // need quizzes for "Assign to Quiz" & "Belongs to"
  }, [dispatch])

  const flash = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }

  const openCreate = () => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) return
    setForm(EMPTY_FORM); setEditingQ(null); setIsDirty(false); setShowForm(true); dispatch(clearError())
  }
  const openEdit = (q: Question) => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) return
    setForm({ text: q.text, options: [...q.options], correctAnswerIndex: q.correctAnswerIndex, keywords: q.keywords.join(', ') })
    setEditingQ(q); setIsDirty(false); setShowForm(true); dispatch(clearError())
  }
  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave without saving?')) return
    setForm(EMPTY_FORM); setEditingQ(null); setIsDirty(false); setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      text: form.text, options: form.options,
      correctAnswerIndex: form.correctAnswerIndex,
      keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
    }
    let result
    if (editingQ) {
      result = await dispatch(updateQuestion({ id: editingQ._id, data: payload }))
    } else {
      result = await dispatch(createQuestion(payload))
    }
    if ((editingQ ? updateQuestion : createQuestion).fulfilled.match(result)) {
      flash(editingQ ? 'Question updated!' : 'Question created!')
      setForm(EMPTY_FORM); setEditingQ(null); setIsDirty(false); setShowForm(false)
      dispatch(fetchAllQuestions())
    }
  }

  const handleDelete = async (q: Question) => {
    if (!window.confirm(`Are you sure you want to delete this question?\n"${q.text}"`)) return
    const r = await dispatch(deleteStandaloneQuestion(q._id))
    if (deleteStandaloneQuestion.fulfilled.match(r)) flash('Question deleted.')
  }

  // "Add to Quiz" from question edit sidebar
  const handleAddToQuiz = async (q: Question, quiz: Quiz) => {
    await dispatch(addExistingQuestionToQuiz({ quizId: quiz._id, questionId: q._id, currentQuestions: quiz.questions }))
    dispatch(fetchQuizzes())
    flash(`Added to "${quiz.title}"`)
  }

  // "Remove from Quiz" from question sidebar
  const handleRemoveFromQuiz = async (q: Question, quiz: Quiz) => {
    if (!window.confirm(`Remove from "${quiz.title}"?`)) return
    await dispatch(removeQuestionFromQuiz({ quizId: quiz._id, questionId: q._id, currentQuestions: quiz.questions }))
    dispatch(fetchQuizzes())
    flash(`Removed from "${quiz.title}"`)
  }

  const isMyQuestion = (q: Question) => q.author === user?._id
  const canEdit = (q: Question) => isMyQuestion(q) || !!user?.admin

  // For each question, find which quizzes contain it
  const getAssociatedQuizzes = (qId: string) => quizzes.filter(quiz => quiz.questions.some(q => q._id === qId))
  const getAvailableQuizzes = (qId: string) => quizzes.filter(quiz => !quiz.questions.some(q => q._id === qId))

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          <i className="bi bi-question-diamond me-2"></i>Question Bank
        </h2>
        <button className="btn btn-success" onClick={openCreate}>
          <i className="bi bi-plus-lg me-1"></i>Add Question
        </button>
      </div>

      {successMsg && <div className="alert alert-success py-2"><i className="bi bi-check-circle me-2"></i>{successMsg}</div>}
      {error && <div className="alert alert-danger py-2"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}

      {/* Create / Edit Form — 2-column layout like EJS edit.ejs */}
      {showForm && (
        <div className="row mb-4">
          {/* Left: Form */}
          <div className="col-md-7 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white">
                <h4 className="mb-0 fw-bold">{editingQ ? 'Edit Question Details' : 'Add Question'}</h4>
              </div>
              <div className="card-body">
                <form id="editQuestionForm" onSubmit={handleSubmit} onChange={() => setIsDirty(true)}>
                  <div className="mb-3">
                    <label className="form-label">Question Text</label>
                    <textarea className="form-control" rows={2} value={form.text}
                      onChange={e => { setForm({ ...form, text: e.target.value }); setIsDirty(true) }}
                      required placeholder="Enter the question" />
                  </div>
                  <label className="form-label">Options</label>
                  <div id="options-container">
                    {form.options.map((opt, i) => (
                      <div key={i} className="input-group mb-2">
                        <div className="input-group-text">
                          <input className="form-check-input mt-0" type="radio"
                            name="correctIndex" value={i}
                            checked={form.correctAnswerIndex === i}
                            onChange={() => { setForm({ ...form, correctAnswerIndex: i }); setIsDirty(true) }}
                            aria-label="Correct answer" />
                        </div>
                        <input type="text" className="form-control" value={opt}
                          placeholder={`Option ${i + 1}`} required
                          onChange={e => {
                            const o = [...form.options]; o[i] = e.target.value
                            setForm({ ...form, options: o }); setIsDirty(true)
                          }} />
                      </div>
                    ))}
                  </div>
                  <div className="mb-3 mt-2">
                    <label className="form-label">Keywords <span className="text-muted">(comma-separated)</span></label>
                    <input className="form-control" value={form.keywords}
                      onChange={e => { setForm({ ...form, keywords: e.target.value }); setIsDirty(true) }}
                      placeholder="e.g. react, hooks, useState" />
                  </div>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                    <button type="button" className="btn btn-secondary me-md-2" onClick={handleCancel}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                      {editingQ ? 'Update Question' : 'Save Question'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right: Belongs to Quizzes + Add to Quiz — only show when editing */}
          {editingQ && (
            <div className="col-md-5">
              {/* Belongs to Quizzes */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0 fw-bold">Belongs to Quizzes</h5>
                </div>
                <div className="list-group list-group-flush" style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {getAssociatedQuizzes(editingQ._id).length === 0 ? (
                    <div className="p-3 text-center text-muted">Not used in any quizzes.</div>
                  ) : (
                    getAssociatedQuizzes(editingQ._id).map(quiz => (
                      <div key={quiz._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="fw-medium">{quiz.title}</span>
                        <form onSubmit={e => { e.preventDefault(); handleRemoveFromQuiz(editingQ, quiz) }}>
                          <button type="submit" className="btn btn-sm btn-outline-danger" title="Remove from this Quiz">
                            <i className="bi bi-x-lg"></i> Remove
                          </button>
                        </form>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add to Quiz */}
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0 fw-bold">Add to Quiz</h5>
                </div>
                <div className="card-body p-0">
                  {getAvailableQuizzes(editingQ._id).length === 0 ? (
                    <div className="alert alert-info m-3 mb-0">No other quizzes available.</div>
                  ) : (
                    <div className="list-group list-group-flush" style={{ maxHeight: 250, overflowY: 'auto' }}>
                      {getAvailableQuizzes(editingQ._id).map(quiz => (
                        <div key={quiz._id} className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="text-truncate" style={{ maxWidth: 200 }}>{quiz.title}</span>
                          <button className="btn btn-sm btn-outline-success"
                            onClick={() => handleAddToQuiz(editingQ, quiz)}>
                            <i className="bi bi-plus-lg"></i> Add to
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Questions Table — matches EJS list.ejs exactly */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '45%' }}>Question Text</th>
                <th style={{ width: '25%' }}>Correct Answer</th>
                <th style={{ width: '10%' }}>Quizzes</th>
                <th className="text-end" style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4 text-muted">No questions found.</td></tr>
              ) : (
                questions.map((q, idx) => {
                  const correct = q.options?.[q.correctAnswerIndex] ?? 'N/A'
                  const inQuizzes = getAssociatedQuizzes(q._id)
                  return (
                    <tr key={q._id}>
                      <th scope="row">{idx + 1}</th>
                      <td>
                        <div>{q.text}</div>
                        {q.keywords?.length > 0 && (
                          <div className="mt-1">
                            {q.keywords.map(k => <span key={k} className="badge bg-light text-secondary border me-1">{k}</span>)}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success">{correct}</span>
                      </td>
                      <td>
                        {inQuizzes.length > 0 ? (
                          <button className="btn btn-sm btn-outline-info"
                            onClick={() => setExpandedSidebar(expandedSidebar === q._id ? null : q._id)}
                            title="View associated quizzes">
                            <i className="bi bi-collection me-1"></i>{inQuizzes.length}
                          </button>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td className="text-end">
                        {canEdit(q) && (
                          <button className="btn btn-sm btn-outline-warning me-1" onClick={() => openEdit(q)}>Edit</button>
                        )}
                        {canEdit(q) && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(q)}>Delete</button>
                        )}
                        {!canEdit(q) && <span className="text-muted small">View only</span>}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
