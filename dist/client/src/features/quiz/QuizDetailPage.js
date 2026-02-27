"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QuizDetailPage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("../../app/hooks");
const quizSlice_1 = require("./quizSlice");
const questionSlice_1 = require("../questions/questionSlice");
const EMPTY_Q = { text: '', options: ['', '', '', ''], correctAnswerIndex: 0, keywords: '' };
function QuizDetailPage() {
    const { id } = (0, react_router_dom_1.useParams)();
    const dispatch = (0, hooks_1.useAppDispatch)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { selectedQuiz, loading, error } = (0, hooks_1.useAppSelector)((s) => s.quiz);
    const { user } = (0, hooks_1.useAppSelector)((s) => s.auth);
    const { questions: allQuestions } = (0, hooks_1.useAppSelector)((s) => s.questions);
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [addTab, setAddTab] = (0, react_1.useState)('existing');
    const [saving, setSaving] = (0, react_1.useState)(false);
    // Single question form
    const [singleQ, setSingleQ] = (0, react_1.useState)(EMPTY_Q);
    // Batch question form
    const [batchQs, setBatchQs] = (0, react_1.useState)([{ ...EMPTY_Q }]);
    (0, react_1.useEffect)(() => {
        if (id)
            dispatch((0, quizSlice_1.fetchQuizById)(id));
        dispatch((0, questionSlice_1.fetchAllQuestions)()); // load question bank for "Select Existing"
        return () => { dispatch((0, quizSlice_1.clearSelectedQuiz)()); };
    }, [dispatch, id]);
    // Regular user → redirect to take quiz
    (0, react_1.useEffect)(() => {
        if (user && !user.admin && id)
            navigate(`/quizzes/${id}/take`);
    }, [user, id, navigate]);
    // Questions not yet in this quiz (for "Select Existing" tab)
    const quizQuestionIds = new Set(selectedQuiz?.questions.map(q => q._id) ?? []);
    const availableQuestions = allQuestions.filter(q => !quizQuestionIds.has(q._id));
    const refresh = () => { if (id)
        dispatch((0, quizSlice_1.fetchQuizById)(id)); };
    // Remove from quiz (don't delete)
    const handleRemoveFromQuiz = async (qId) => {
        if (!selectedQuiz || !id)
            return;
        if (!window.confirm('Remove this question from the quiz? (Question is NOT deleted from the bank)'))
            return;
        await dispatch((0, quizSlice_1.removeQuestionFromQuiz)({ quizId: id, questionId: qId, currentQuestions: selectedQuiz.questions }));
        refresh();
    };
    // Delete question entirely
    const handleDeletePermanently = async (qId) => {
        if (!window.confirm('PERMANENTLY delete this question? It will be removed from ALL quizzes.'))
            return;
        await dispatch((0, quizSlice_1.deleteQuestion)({ questionId: qId }));
        refresh();
    };
    // Add existing question from bank
    const handleAddExisting = async (qId) => {
        if (!selectedQuiz || !id)
            return;
        setSaving(true);
        await dispatch((0, quizSlice_1.addExistingQuestionToQuiz)({ quizId: id, questionId: qId, currentQuestions: selectedQuiz.questions }));
        refresh();
        setSaving(false);
    };
    // Create single new question
    const handleAddSingle = async (e) => {
        e.preventDefault();
        if (!id)
            return;
        setSaving(true);
        await dispatch((0, quizSlice_1.addQuestionToQuiz)({
            quizId: id,
            question: {
                text: singleQ.text, options: singleQ.options,
                correctAnswerIndex: singleQ.correctAnswerIndex,
                keywords: singleQ.keywords.split(',').map(k => k.trim()).filter(Boolean),
            }
        }));
        refresh();
        setSingleQ(EMPTY_Q);
        setShowAdd(false);
        setSaving(false);
    };
    // Create batch new questions
    const handleAddBatch = async (e) => {
        e.preventDefault();
        if (!id)
            return;
        setSaving(true);
        const questions = batchQs.map(q => ({
            text: q.text, options: q.options,
            correctAnswerIndex: q.correctAnswerIndex,
            keywords: q.keywords.split(',').map(k => k.trim()).filter(Boolean),
        }));
        await dispatch((0, quizSlice_1.addManyQuestionsToQuiz)({ quizId: id, questions }));
        refresh();
        setBatchQs([{ ...EMPTY_Q }]);
        setShowAdd(false);
        setSaving(false);
    };
    if (loading)
        return (<div className="text-center py-5">
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
    </div>);
    if (error)
        return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
    if (!selectedQuiz)
        return null;
    return (<div className="container mt-4">
      <a className="text-decoration-none text-muted mb-2 d-inline-block" onClick={() => navigate('/quizzes')} style={{ cursor: 'pointer' }}>
        ← Back to List
      </a>

      <div className="row mt-2">
        {/* LEFT: Quiz Info + Edit form */}
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h4 className="mb-0 fw-bold">{selectedQuiz.title}</h4>
            </div>
            <div className="card-body">
              <p className="text-muted">{selectedQuiz.description || 'No description'}</p>
              <hr />
              <div className="d-flex gap-2">
                <button className="btn btn-outline-warning btn-sm" onClick={() => navigate(`/admin/quizzes/${id}/edit`)}>
                  <i className="bi bi-pencil me-1"></i>Edit Quiz Info
                </button>
                <button className="btn btn-outline-primary btn-sm" onClick={() => { setShowAdd(!showAdd); setAddTab('existing'); }}>
                  <i className="bi bi-plus-circle me-1"></i>{showAdd ? 'Hide' : 'Add'} Questions
                </button>
              </div>
            </div>

            {/* Questions list (compact, like EJS list-group) */}
            <div className="card-header bg-white d-flex justify-content-between align-items-center border-top">
              <h5 className="mb-0 fw-bold">Questions in this Quiz</h5>
              <span className="badge bg-primary rounded-pill">{selectedQuiz.questions.length}</span>
            </div>
            <div className="list-group list-group-flush" style={{ maxHeight: 420, overflowY: 'auto' }}>
              {selectedQuiz.questions.length === 0 ? (<div className="p-4 text-center text-muted">No questions assigned yet.</div>) : (selectedQuiz.questions.map((q, idx) => {
            const correctText = q.options?.[q.correctAnswerIndex] ?? 'N/A';
            return (<div key={q._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="w-100 me-2">
                          <div className="fw-bold mb-1">{idx + 1}. {q.text}</div>
                          <span className="badge bg-success bg-opacity-10 text-success small">
                            <i className="bi bi-check-circle me-1"></i>Answer: {correctText}
                          </span>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <button className="btn btn-sm btn-outline-warning" onClick={() => handleRemoveFromQuiz(q._id)} title="Remove from quiz (keep in bank)">
                            <i className="bi bi-dash-circle"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePermanently(q._id)} title="Delete permanently">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>);
        }))}
            </div>
          </div>
        </div>

        {/* RIGHT: Add Questions Section */}
        {showAdd && (<div className="col-md-7">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0 fw-bold">Add Question</h5>
              </div>
              <div className="card-body">
                {/* Nav tabs — mirrors EJS exactly */}
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button className={`nav-link ${addTab === 'existing' ? 'active' : ''}`} onClick={() => setAddTab('existing')}>
                      Select Existing
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${addTab === 'new' ? 'active' : ''}`} onClick={() => setAddTab('new')}>
                      Create New
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${addTab === 'batch' ? 'active' : ''}`} onClick={() => setAddTab('batch')}>
                      Create Batch
                    </button>
                  </li>
                </ul>

                {/* Tab: Select Existing */}
                {addTab === 'existing' && (availableQuestions.length === 0 ? (<div className="alert alert-info py-2 mb-0">No more available questions to add.</div>) : (<div className="list-group list-group-flush" style={{ maxHeight: 400, overflowY: 'auto' }}>
                      {availableQuestions.map(q => {
                    const correctText = q.options?.[q.correctAnswerIndex] ?? 'N/A';
                    return (<div key={q._id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="w-100 me-3">
                                <div className="fw-bold mb-1">{q.text}</div>
                                <span className="badge bg-secondary bg-opacity-25 text-dark small">
                                  <i className="bi bi-check-circle me-1"></i>Answer: {correctText}
                                </span>
                                {q.keywords?.length > 0 && (<div className="mt-1">
                                    {q.keywords.map(k => (<span key={k} className="badge bg-light text-secondary border me-1">{k}</span>))}
                                  </div>)}
                              </div>
                              <button className="btn btn-sm btn-outline-success" disabled={saving} onClick={() => handleAddExisting(q._id)}>
                                <i className="bi bi-plus-lg"></i> Add
                              </button>
                            </div>
                          </div>);
                })}
                    </div>))}

                {/* Tab: Create New (single) */}
                {addTab === 'new' && (<form onSubmit={handleAddSingle}>
                    <div className="mb-3">
                      <label className="form-label">Question Text</label>
                      <textarea className="form-control" rows={2} value={singleQ.text} onChange={e => setSingleQ({ ...singleQ, text: e.target.value })} required placeholder="Enter the question"/>
                    </div>
                    <label className="form-label">Options</label>
                    <div id="questions-container">
                      {singleQ.options.map((opt, i) => (<div key={i} className="input-group mb-2">
                          <div className="input-group-text">
                            <input className="form-check-input mt-0" type="radio" name="singleCorrect" value={i} checked={singleQ.correctAnswerIndex === i} onChange={() => setSingleQ({ ...singleQ, correctAnswerIndex: i })} aria-label="Correct answer"/>
                          </div>
                          <input type="text" className="form-control" value={opt} placeholder={`Option ${i + 1}`} required onChange={e => { const o = [...singleQ.options]; o[i] = e.target.value; setSingleQ({ ...singleQ, options: o }); }}/>
                        </div>))}
                    </div>
                    <div className="mb-3 mt-2">
                      <label className="form-label">Keywords <span className="text-muted">(comma-separated)</span></label>
                      <input className="form-control" value={singleQ.keywords} onChange={e => setSingleQ({ ...singleQ, keywords: e.target.value })} placeholder="e.g. react, hooks"/>
                    </div>
                    <div className="d-grid">
                      <button type="submit" className="btn btn-success" disabled={saving}>
                        {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                        Create & Add Question
                      </button>
                    </div>
                  </form>)}

                {/* Tab: Batch Create */}
                {addTab === 'batch' && (<form onSubmit={handleAddBatch}>
                    <div id="questions-container" style={{ maxHeight: 500, overflowY: 'auto', paddingRight: 8 }}>
                      {batchQs.map((q, qi) => (<div key={qi} className="card mb-3">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <span>Question {qi + 1}</span>
                            {batchQs.length > 1 && (<button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setBatchQs(batchQs.filter((_, i) => i !== qi))}>
                                &times;
                              </button>)}
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label">Question Text</label>
                              <textarea className="form-control" rows={2} value={q.text} required placeholder="Enter the question" onChange={e => { const b = [...batchQs]; b[qi] = { ...b[qi], text: e.target.value }; setBatchQs(b); }}/>
                            </div>
                            <label className="form-label">Options</label>
                            <div>
                              {q.options.map((opt, oi) => (<div key={oi} className="input-group mb-2">
                                  <div className="input-group-text">
                                    <input className="form-check-input mt-0" type="radio" name={`batch-${qi}-correct`} value={oi} checked={q.correctAnswerIndex === oi} onChange={() => { const b = [...batchQs]; b[qi] = { ...b[qi], correctAnswerIndex: oi }; setBatchQs(b); }} aria-label="Correct answer"/>
                                  </div>
                                  <input type="text" className="form-control" value={opt} placeholder={`Option ${oi + 1}`} required onChange={e => {
                            const b = [...batchQs];
                            const o = [...b[qi].options];
                            o[oi] = e.target.value;
                            b[qi] = { ...b[qi], options: o };
                            setBatchQs(b);
                        }}/>
                                </div>))}
                            </div>
                          </div>
                        </div>))}
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <button type="button" className="btn btn-outline-primary" onClick={() => setBatchQs([...batchQs, { ...EMPTY_Q }])}>
                        <i className="bi bi-plus-circle me-1"></i>Add Another Question
                      </button>
                    </div>
                    <div className="d-grid">
                      <button type="submit" className="btn btn-success" disabled={saving}>
                        {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                        Create & Add All Questions
                      </button>
                    </div>
                  </form>)}
              </div>
            </div>
          </div>)}
      </div>
    </div>);
}
