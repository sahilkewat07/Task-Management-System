const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Generate a signed JWT token for a user
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (admin or employee)
 * @access  Public
 */
const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorResponse('Email already registered.', 400));
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password, role: role || 'employee' });

    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: 'Registration successful.',
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Email and password are required.', 400));
    }

    // Explicitly select password (hidden by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials.', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials.', 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
const getMe = asyncHandler(async (req, res, next) => {
    res.status(200).json({ success: true, user: req.user });
});

module.exports = { register, login, getMe };
