require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error');

// ─── Initialize Express ───────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ─── Security & Logging ───────────────────────────────────────────────
app.use(helmet()); // Trust headers
app.use(morgan('dev')); // Dev logging

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
    }
});

// ─── Connect to MongoDB ───────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Socket.io Logic ──────────────────────────────────────────────────
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Attach io to app for use in controllers
app.set('io', io);

// ─── Routes ───────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

// ─── Health Check ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running 🚀', timestamp: new Date() });
});

// ─── 404 Handler ──────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
