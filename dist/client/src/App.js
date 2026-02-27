"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_router_dom_1 = require("react-router-dom");
const react_redux_1 = require("react-redux");
const store_1 = require("./app/store");
const Navbar_1 = __importDefault(require("./components/Navbar"));
const ProtectedRoute_1 = require("./components/ProtectedRoute");
const AuthPage_1 = __importDefault(require("./features/auth/AuthPage"));
const QuizListPage_1 = __importDefault(require("./features/quiz/QuizListPage"));
const TakeQuizPage_1 = __importDefault(require("./features/quiz/TakeQuizPage"));
const QuizDetailPage_1 = __importDefault(require("./features/quiz/QuizDetailPage"));
const AdminQuizForm_1 = __importDefault(require("./features/quiz/AdminQuizForm"));
const QuestionsPage_1 = __importDefault(require("./features/questions/QuestionsPage"));
const UsersPage_1 = __importDefault(require("./features/users/UsersPage"));
function Layout({ children }) {
    return (<>
      <Navbar_1.default />
      <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        {children}
      </main>
      <footer className="py-3 text-center text-muted border-top" style={{ background: '#fff' }}>
        <small>© 2024 QuizMaster · Built with React + Redux + Express</small>
      </footer>
    </>);
}
function App() {
    return (<react_redux_1.Provider store={store_1.store}>
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          {/* Public routes */}
          <react_router_dom_1.Route path="/login" element={<AuthPage_1.default />}/>
          <react_router_dom_1.Route path="/signup" element={<AuthPage_1.default />}/>

          {/* Protected routes — any logged-in user */}
          <react_router_dom_1.Route path="/quizzes" element={<ProtectedRoute_1.ProtectedRoute><Layout><QuizListPage_1.default /></Layout></ProtectedRoute_1.ProtectedRoute>}/>
          <react_router_dom_1.Route path="/quizzes/:id/take" element={<ProtectedRoute_1.ProtectedRoute><Layout><TakeQuizPage_1.default /></Layout></ProtectedRoute_1.ProtectedRoute>}/>
          <react_router_dom_1.Route path="/quizzes/:id" element={<ProtectedRoute_1.ProtectedRoute><Layout><QuizDetailPage_1.default /></Layout></ProtectedRoute_1.ProtectedRoute>}/>

          {/* Questions Bank — any logged-in user can view/create; author can edit/delete */}
          <react_router_dom_1.Route path="/questions" element={<ProtectedRoute_1.ProtectedRoute><Layout><QuestionsPage_1.default /></Layout></ProtectedRoute_1.ProtectedRoute>}/>

          {/* Admin-only routes */}
          <react_router_dom_1.Route path="/admin/quizzes/new" element={<ProtectedRoute_1.AdminRoute><Layout><AdminQuizForm_1.default /></Layout></ProtectedRoute_1.AdminRoute>}/>
          <react_router_dom_1.Route path="/admin/quizzes/:id/edit" element={<ProtectedRoute_1.AdminRoute><Layout><AdminQuizForm_1.default /></Layout></ProtectedRoute_1.AdminRoute>}/>
          <react_router_dom_1.Route path="/admin/users" element={<ProtectedRoute_1.AdminRoute><Layout><UsersPage_1.default /></Layout></ProtectedRoute_1.AdminRoute>}/>

          {/* Default redirect */}
          <react_router_dom_1.Route path="/" element={<react_router_dom_1.Navigate to="/quizzes" replace/>}/>
          <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/quizzes" replace/>}/>
        </react_router_dom_1.Routes>
      </react_router_dom_1.BrowserRouter>
    </react_redux_1.Provider>);
}
