const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Authenticate JWT token
 * Attaches the decoded user to req.user
 */
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided. Access denied.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found. Token invalid.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
    }
};

module.exports = auth;
