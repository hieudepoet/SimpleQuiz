"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// GET /api/users - Get all users (Admin only)
router.get('/', authenticate_1.verifyUser, authenticate_1.verifyAdmin, user_controller_1.getAllUsers);
exports.default = router;
