"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("../app/hooks");
const authSlice_1 = require("../features/auth/authSlice");
function Navbar() {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const { user } = (0, hooks_1.useAppSelector)((s) => s.auth);
    const handleLogout = () => {
        dispatch((0, authSlice_1.logout)());
        navigate('/login');
    };
    const isActive = (path) => location.pathname.startsWith(path) ? 'active text-white' : '';
    return (<nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(90deg,#1e3a8a,#3b82f6)' }}>
      <div className="container">
        <react_router_dom_1.Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="bi bi-mortarboard-fill me-2"></i>QuizMaster
        </react_router_dom_1.Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            {user ? (<>
                <li className="nav-item">
                  <react_router_dom_1.Link className={`nav-link ${isActive('/quizzes')}`} to="/quizzes">
                    <i className="bi bi-collection me-1"></i>Quizzes
                  </react_router_dom_1.Link>
                </li>
                <li className="nav-item">
                  <react_router_dom_1.Link className={`nav-link ${isActive('/questions')}`} to="/questions">
                    <i className="bi bi-question-diamond me-1"></i>Questions
                  </react_router_dom_1.Link>
                </li>
                {user.admin && (<>
                    <li className="nav-item">
                      <react_router_dom_1.Link className={`nav-link ${isActive('/admin/quizzes/new')}`} to="/admin/quizzes/new">
                        <i className="bi bi-plus-circle me-1"></i>New Quiz
                      </react_router_dom_1.Link>
                    </li>
                    <li className="nav-item">
                      <react_router_dom_1.Link className={`nav-link ${isActive('/admin/users')}`} to="/admin/users">
                        <i className="bi bi-people me-1"></i>Users
                      </react_router_dom_1.Link>
                    </li>
                  </>)}
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
              </>) : (<>
                <li className="nav-item">
                  <react_router_dom_1.Link className="nav-link" to="/login">Login</react_router_dom_1.Link>
                </li>
                <li className="nav-item">
                  <react_router_dom_1.Link className="btn btn-outline-light btn-sm" to="/signup">Sign Up</react_router_dom_1.Link>
                </li>
              </>)}
          </ul>
        </div>
      </div>
    </nav>);
}
