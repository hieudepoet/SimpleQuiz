import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchQuizById, clearSelectedQuiz } from './quizSlice'

export default function TakeQuizPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selectedQuiz, loading } = useAppSelector((s) => s.quiz)

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>([])

  // Store the quiz ID that answers was last initialized for.
  // When it differs during render, reset answers for the new quiz.
  // This is React's recommended "Storing information from previous renders"
  // pattern: https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [prevQuizId, setPrevQuizId] = useState<string | undefined>(undefined)
  if (selectedQuiz && selectedQuiz._id !== prevQuizId) {
    setPrevQuizId(selectedQuiz._id)
    setAnswers(new Array(selectedQuiz.questions.length).fill(null))
  }

  useEffect(() => {
    if (id) dispatch(fetchQuizById(id))
    return () => { dispatch(clearSelectedQuiz()) }
  }, [dispatch, id])

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
    </div>
  )
  if (!selectedQuiz) return null
  if (!selectedQuiz.questions || selectedQuiz.questions.length === 0) return (
    <div className="container py-5 text-center">
      <p className="text-muted">This quiz has no questions yet.</p>
      <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/quizzes')}>
        <i className="bi bi-arrow-left me-1"></i>Back to Quizzes
      </button>
    </div>
  )

  const questions = selectedQuiz.questions
  const question = questions[current]
  const totalQ = questions.length

  const handleSelect = (i: number) => {
    if (submitted) return
    setSelected(i)
  }

  const handleNext = () => {
    const newAnswers = [...answers]
    newAnswers[current] = selected
    setAnswers(newAnswers)
    setSelected(null)
    if (current < totalQ - 1) setCurrent(current + 1)
  }

  const handleSubmit = () => {
    const newAnswers = [...answers]
    newAnswers[current] = selected
    setAnswers(newAnswers)
    setSubmitted(true)
  }

  const score = submitted ? answers.filter((a, i) => a === questions[i]?.correctAnswerIndex).length : 0
  const percent = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0

  if (submitted) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card border-0 shadow-lg rounded-4 p-4">
              <div className="mb-3">
                {percent >= 70
                  ? <i className="bi bi-trophy-fill text-warning" style={{ fontSize: '4rem' }}></i>
                  : <i className="bi bi-emoji-neutral text-secondary" style={{ fontSize: '4rem' }}></i>}
              </div>
              <h3 className="fw-bold">Quiz Complete!</h3>
              <h4 className="text-primary fw-bold my-3">{score} / {totalQ} correct</h4>
              <div className="progress mb-3" style={{ height: '1.5rem' }}>
                <div
                  className={`progress-bar fw-bold ${percent >= 70 ? 'bg-success' : percent >= 50 ? 'bg-warning' : 'bg-danger'}`}
                  style={{ width: `${percent}%` }}
                >{percent}%</div>
              </div>
              <p className="text-muted fs-5">
                {percent === 100 ? '🎉 Perfect score!' : percent >= 70 ? '👍 Good job!' : '📚 Keep practicing!'}
              </p>

              {/* Review answers */}
              <div className="text-start mt-4">
                <h6 className="fw-bold mb-3">Review:</h6>
                {questions.map((q, i) => (
                  <div key={q._id} className={`mb-2 p-3 rounded border ${answers[i] === q.correctAnswerIndex ? 'border-success bg-success bg-opacity-10' : 'border-danger bg-danger bg-opacity-10'}`}>
                    <div className="fw-semibold mb-1">
                      {answers[i] === q.correctAnswerIndex
                        ? <i className="bi bi-check-circle-fill text-success me-1"></i>
                        : <i className="bi bi-x-circle-fill text-danger me-1"></i>}
                      Q{i + 1}: {q.text}
                    </div>
                    <small>
                      Your answer: <span className="fw-semibold">{answers[i] !== null ? q.options[answers[i]!] : 'Not answered'}</span>
                      {answers[i] !== q.correctAnswerIndex && (
                        <> · Correct: <span className="text-success fw-semibold">{q.options[q.correctAnswerIndex]}</span></>
                      )}
                    </small>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2 justify-content-center mt-4">
                <button className="btn btn-outline-secondary" onClick={() => navigate('/quizzes')}>
                  <i className="bi bi-arrow-left me-1"></i>Back to Quizzes
                </button>
                <button className="btn btn-primary" onClick={() => { setSubmitted(false); setCurrent(0); setSelected(null); setAnswers(new Array(totalQ).fill(null)) }}>
                  <i className="bi bi-arrow-repeat me-1"></i>Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="mb-3">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/quizzes')}>
              <i className="bi bi-arrow-left me-1"></i>Back
            </button>
          </div>
          <h4 className="fw-bold text-primary mb-1">{selectedQuiz.title}</h4>
          <p className="text-muted small mb-3">{selectedQuiz.description}</p>

          {/* Progress bar */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">Question {current + 1} of {totalQ}</small>
            <small className="text-muted">{Math.round(((current) / totalQ) * 100)}% complete</small>
          </div>
          <div className="progress mb-4" style={{ height: '8px' }}>
            <div className="progress-bar bg-primary" style={{ width: `${((current) / totalQ) * 100}%` }}></div>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Q{current + 1}. {question.text}</h5>
              <div className="d-flex flex-column gap-2">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`btn text-start p-3 border rounded-3 ${selected === i ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                    onClick={() => handleSelect(i)}
                    style={{ transition: 'all 0.15s' }}
                  >
                    <span className="fw-bold me-2">{String.fromCharCode(65 + i)}.</span>{opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            {current < totalQ - 1 ? (
              <button
                className="btn btn-primary px-4"
                onClick={handleNext}
                disabled={selected === null}
              >
                Next <i className="bi bi-arrow-right ms-1"></i>
              </button>
            ) : (
              <button
                className="btn btn-success px-4 fw-semibold"
                onClick={handleSubmit}
                disabled={selected === null}
              >
                <i className="bi bi-check-lg me-1"></i>Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
