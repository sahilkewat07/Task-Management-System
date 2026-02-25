const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getMyTasks,
    updateTaskStatus,
    getDashboardStats,
    getEmployees,
} = require('../controllers/taskController');

// ─── Task Validation ──────────────────────────
const taskValidation = [
    check('title', 'Title is required').not().isEmpty(),
    check('deadline', 'Deadline must be a valid date').isISO8601(),
    check('assignedTo', 'Assigned employee ID is required').isMongoId(),
];

const statusValidation = [
    check('status', 'Invalid status').isIn(['Pending', 'In Progress', 'Completed']),
];

// ─── Shared Routes (authenticated) ───────────────────────────────────
// Dashboard stats — role-aware inside controller
router.get('/stats', auth, getDashboardStats);

// ─── Employee Routes ───────────────────────────────────────────────────
// IMPORTANT: /my must be defined BEFORE /:id to avoid route collision
router.get('/my', auth, requireRole('employee'), getMyTasks);
router.put('/:id/status', auth, requireRole('employee'), validate(statusValidation), updateTaskStatus);

// ─── Admin Routes ──────────────────────────────────────────────────────
router.get('/employees', auth, requireRole('admin'), getEmployees);
router.post('/', auth, requireRole('admin'), validate(taskValidation), createTask);
router.get('/', auth, requireRole('admin'), getAllTasks);
router.put('/:id', auth, requireRole('admin'), updateTask);
router.delete('/:id', auth, requireRole('admin'), deleteTask);

module.exports = router;
