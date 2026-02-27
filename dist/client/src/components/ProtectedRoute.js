"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = exports.ProtectedRoute = void 0;
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("../app/hooks");
const ProtectedRoute = ({ children }) => {
    const { user } = (0, hooks_1.useAppSelector)((s) => s.auth);
    if (!user)
        return <react_router_dom_1.Navigate to="/login" replace/>;
    return <>{children}</>;
};
exports.ProtectedRoute = ProtectedRoute;
const AdminRoute = ({ children }) => {
    const { user } = (0, hooks_1.useAppSelector)((s) => s.auth);
    if (!user)
        return <react_router_dom_1.Navigate to="/login" replace/>;
    if (!user.admin)
        return <react_router_dom_1.Navigate to="/quizzes" replace/>;
    return <>{children}</>;
};
exports.AdminRoute = AdminRoute;
