"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersPage;
const react_1 = require("react");
const hooks_1 = require("../../app/hooks");
const userSlice_1 = require("./userSlice");
function UsersPage() {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const { users, loading, error } = (0, hooks_1.useAppSelector)((s) => s.users);
    const currentUser = (0, hooks_1.useAppSelector)((s) => s.auth.user);
    (0, react_1.useEffect)(() => {
        dispatch((0, userSlice_1.fetchAllUsers)());
    }, [dispatch]);
    const admins = users.filter((u) => u.admin);
    const regulars = users.filter((u) => !u.admin);
    return (<div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-primary mb-1">
          <i className="bi bi-people me-2"></i>User Management
        </h2>
        <p className="text-muted">All registered users in the system.</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 text-white h-100" style={{ background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-4 fw-bold">{users.length}</div>
                  <div className="small opacity-75">Total Users</div>
                </div>
                <i className="bi bi-people-fill fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 text-white h-100" style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-4 fw-bold">{admins.length}</div>
                  <div className="small opacity-75">Admins</div>
                </div>
                <i className="bi bi-shield-fill-check fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 text-white h-100" style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-4 fw-bold">{regulars.length}</div>
                  <div className="small opacity-75">Regular Users</div>
                </div>
                <i className="bi bi-person-fill fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (<div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
        </div>)}
      {error && <div className="alert alert-danger"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}

      {!loading && (<div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom fw-semibold text-muted">
            <i className="bi bi-table me-2"></i>All Users ({users.length})
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (<tr key={u._id} className={u._id === currentUser?._id ? 'table-primary' : ''}>
                    <td className="text-muted small">{idx + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{
                    width: 32, height: 32, fontSize: 13,
                    background: u.admin
                        ? 'linear-gradient(135deg,#d97706,#f59e0b)'
                        : 'linear-gradient(135deg,#1e3a8a,#3b82f6)'
                }}>
                          {u.username[0].toUpperCase()}
                        </div>
                        <span className="fw-semibold">{u.username}</span>
                        {u._id === currentUser?._id && (<span className="badge bg-info text-dark ms-1">You</span>)}
                      </div>
                    </td>
                    <td>
                      {u.admin
                    ? <span className="badge bg-warning text-dark"><i className="bi bi-shield-fill-check me-1"></i>Admin</span>
                    : <span className="badge bg-secondary"><i className="bi bi-person me-1"></i>User</span>}
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        <i className="bi bi-circle-fill me-1" style={{ fontSize: 8 }}></i>Active
                      </span>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}
    </div>);
}
