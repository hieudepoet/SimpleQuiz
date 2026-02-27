"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthPage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("../../app/hooks");
const authSlice_1 = require("./authSlice");
// Best practice: admin signup requires a secret code
// In production, this should be an env var / invitation system
const ADMIN_SECRET = 'admin2024';
function AuthPage() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const dispatch = (0, hooks_1.useAppDispatch)();
    const { user, loading, error } = (0, hooks_1.useAppSelector)((s) => s.auth);
    const [tab, setTab] = (0, react_1.useState)('login');
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [isAdmin, setIsAdmin] = (0, react_1.useState)(false);
    const [adminCode, setAdminCode] = (0, react_1.useState)('');
    const [adminCodeError, setAdminCodeError] = (0, react_1.useState)('');
    const [successMsg, setSuccessMsg] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        if (user)
            navigate('/quizzes');
    }, [user, navigate]);
    const resetForm = () => {
        setUsername('');
        setPassword('');
        setIsAdmin(false);
        setAdminCode('');
        setAdminCodeError('');
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch((0, authSlice_1.clearError)());
        const result = await dispatch((0, authSlice_1.login)({ username, password }));
        if (authSlice_1.login.fulfilled.match(result))
            navigate('/quizzes');
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        dispatch((0, authSlice_1.clearError)());
        setAdminCodeError('');
        // Validate admin secret code
        if (isAdmin && adminCode !== ADMIN_SECRET) {
            setAdminCodeError('Invalid admin code. Please check and try again.');
            return;
        }
        const result = await dispatch((0, authSlice_1.signup)({ username, password, admin: isAdmin }));
        if (authSlice_1.signup.fulfilled.match(result)) {
            setSuccessMsg(`Account created${isAdmin ? ' (Admin)' : ''}! Please login.`);
            setTab('login');
            resetForm();
        }
    };
    const switchTab = (t) => {
        setTab(t);
        dispatch((0, authSlice_1.clearError)());
        setSuccessMsg('');
        resetForm();
    };
    return (<div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="text-center mb-4">
              <i className="bi bi-mortarboard-fill text-white" style={{ fontSize: '3rem' }}></i>
              <h2 className="text-white fw-bold mt-2">QuizMaster</h2>
              <p className="text-white-50">Learn, Quiz, Excel</p>
            </div>
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                {/* Tabs */}
                <ul className="nav nav-tabs mb-4 border-0" role="tablist">
                  <li className="nav-item flex-fill text-center">
                    <button className={`nav-link w-100 fw-semibold ${tab === 'login' ? 'active text-primary border-bottom border-primary border-2' : 'text-muted'}`} onClick={() => switchTab('login')}>
                      <i className="bi bi-box-arrow-in-right me-1"></i>Login
                    </button>
                  </li>
                  <li className="nav-item flex-fill text-center">
                    <button className={`nav-link w-100 fw-semibold ${tab === 'signup' ? 'active text-primary border-bottom border-primary border-2' : 'text-muted'}`} onClick={() => switchTab('signup')}>
                      <i className="bi bi-person-plus me-1"></i>Sign Up
                    </button>
                  </li>
                </ul>

                {error && <div className="alert alert-danger py-2"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}
                {successMsg && <div className="alert alert-success py-2"><i className="bi bi-check-circle me-2"></i>{successMsg}</div>}

                <form onSubmit={tab === 'login' ? handleLogin : handleSignup}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input type="text" className="form-control form-control-lg" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus/>
                  </div>
                  <div className={`mb-${tab === 'signup' ? 3 : 4}`}>
                    <label className="form-label fw-semibold">Password</label>
                    <input type="password" className="form-control form-control-lg" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                  </div>

                  {/* Admin signup section */}
                  {tab === 'signup' && (<div className="mb-4">
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="isAdminCheck" checked={isAdmin} onChange={(e) => { setIsAdmin(e.target.checked); setAdminCode(''); setAdminCodeError(''); }}/>
                        <label className="form-check-label fw-semibold" htmlFor="isAdminCheck">
                          <i className="bi bi-shield-lock me-1 text-warning"></i>Register as Admin
                        </label>
                      </div>

                      {isAdmin && (<div>
                          <input type="password" className={`form-control ${adminCodeError ? 'is-invalid' : ''}`} placeholder="Enter admin secret code" value={adminCode} onChange={(e) => { setAdminCode(e.target.value); setAdminCodeError(''); }}/>
                          {adminCodeError && <div className="invalid-feedback">{adminCodeError}</div>}
                          <small className="text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            Admin accounts require a secret code. Contact your system administrator.
                          </small>
                        </div>)}
                    </div>)}

                  <div className="d-grid">
                    <button type="submit" className="btn btn-lg fw-semibold text-white" disabled={loading} style={{ background: 'linear-gradient(90deg,#1e3a8a,#3b82f6)', border: 'none' }}>
                      {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Please wait...</>) : tab === 'login' ? (<><i className="bi bi-box-arrow-in-right me-2"></i>Login</>) : (<><i className={`bi ${isAdmin ? 'bi-shield-check' : 'bi-person-plus'} me-2`}></i>
                          Create {isAdmin ? 'Admin ' : ''}Account</>)}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {tab === 'signup' && (<p className="text-center text-white-50 small mt-3">
                <i className="bi bi-info-circle me-1"></i>
                Admin code for demo: <code className="text-warning">admin2024</code>
              </p>)}
          </div>
        </div>
      </div>
    </div>);
}
