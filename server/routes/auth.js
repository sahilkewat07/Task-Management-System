const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

// ─── Registration Validation ──────────────────
const registerValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
];

// ─── Login Validation ─────────────────────────
const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
];

// Public routes
router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);

// Protected route
router.get('/me', auth, getMe);

module.exports = router;
