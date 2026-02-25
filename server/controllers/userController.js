const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }
    res.status(200).json({ success: true, user });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res, next) => {
    const updates = {
        name: req.body.name,
    };

    if (req.file) {
        updates.avatar = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, user });
});

module.exports = {
    getProfile,
    updateProfile
};
