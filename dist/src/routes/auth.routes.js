"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// POST /api/auth/signup - Register new user
router.post('/signup', auth_controller_1.signup);
// POST /api/auth/login - Login and get JWT token
router.post('/login', auth_controller_1.login);
exports.default = router;
