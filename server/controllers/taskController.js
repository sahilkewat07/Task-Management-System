const Task = require('../models/Task');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// ─────────────────────────────────────────────
// ADMIN CONTROLLERS
// ─────────────────────────────────────────────

/**
 * @route   POST /api/tasks
 * @desc    Admin: Create a new task and assign to employee
 * @access  Private (Admin)
 */
const createTask = asyncHandler(async (req, res, next) => {
    const { title, description, priority, deadline, assignedTo, status } = req.body;

    if (!title || !deadline || !assignedTo) {
        return next(new ErrorResponse('Title, deadline, and assignedTo are required.', 400));
    }

    // Validate the assigned employee exists and is an employee
    const employee = await User.findById(assignedTo);
    if (!employee || employee.role !== 'employee') {
        return next(new ErrorResponse('Invalid employee ID.', 400));
    }

    const task = await Task.create({
        title,
        description,
        priority: priority || 'Medium',
        deadline,
        assignedTo,
        status: status || 'Pending',
        createdBy: req.user._id,
    });

    await task.populate([
        { path: 'assignedTo', select: 'name email' },
        { path: 'createdBy', select: 'name email' },
    ]);

    // Emit socket event
    const io = req.app.get('io');
    io.to(assignedTo.toString()).emit('task_assigned', {
        message: `New task assigned: ${title}`,
        task
    });

    res.status(201).json({ success: true, message: 'Task created successfully.', task });
});

/**
 * @route   GET /api/tasks
 * @desc    Admin: Get all tasks
 * @access  Private (Admin)
 */
const getAllTasks = asyncHandler(async (req, res, next) => {
    const tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, tasks });
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Admin: Update a task (full update)
 * @access  Private (Admin)
 */
const updateTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return next(new ErrorResponse('Task not found.', 404));
    }

    // P0 Security: Explicitly define allowed fields to prevent NoSQL Injection
    const { title, description, priority, deadline, status, assignedTo } = req.body;
    const updateData = { title, description, priority, deadline, status, assignedTo };

    // Remove undefined values to avoid overwriting with null
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    )
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    res.status(200).json({ success: true, message: 'Task updated successfully.', task: updatedTask });
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Admin: Delete a task
 * @access  Private (Admin)
 */
const deleteTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return next(new ErrorResponse('Task not found.', 404));
    }

    await task.deleteOne();
    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
});

// ─────────────────────────────────────────────
// EMPLOYEE CONTROLLERS
// ─────────────────────────────────────────────

/**
 * @route   GET /api/tasks/my
 * @desc    Employee: Get tasks assigned to the current user
 * @access  Private (Employee)
 */
const getMyTasks = asyncHandler(async (req, res, next) => {
    const tasks = await Task.find({ assignedTo: req.user._id })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, tasks });
});

/**
 * @route   PUT /api/tasks/:id/status
 * @desc    Employee: Update the status of an assigned task
 * @access  Private (Employee)
 */
const updateTaskStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'In Progress', 'Completed'];

    if (!status || !allowedStatuses.includes(status)) {
        return next(new ErrorResponse('Invalid status value.', 400));
    }

    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user._id });
    if (!task) {
        return next(new ErrorResponse('Task not found or not assigned to you.', 404));
    }

    task.status = status;
    await task.save();

    // Emit socket event to admin
    const io = req.app.get('io');
    io.to(task.createdBy.toString()).emit('task_status_updated', {
        message: `Task "${task.title}" status updated to ${status} by ${req.user.name}`,
        task
    });

    res.status(200).json({ success: true, message: 'Task status updated.', task });
});

// ─────────────────────────────────────────────
// SHARED / DASHBOARD CONTROLLERS
// ─────────────────────────────────────────────

/**
 * @route   GET /api/tasks/stats
 * @desc    Get dashboard statistics (role-aware)
 * @access  Private
 */
const getDashboardStats = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'admin') {
        const [totalTasks, completedTasks, pendingTasks, inProgressTasks, totalUsers] = await Promise.all([
            Task.countDocuments(),
            Task.countDocuments({ status: 'Completed' }),
            Task.countDocuments({ status: 'Pending' }),
            Task.countDocuments({ status: 'In Progress' }),
            User.countDocuments({ role: 'employee' }),
        ]);

        res.status(200).json({
            success: true,
            stats: { totalTasks, completedTasks, pendingTasks, inProgressTasks, totalUsers },
        });
    } else {
        // Employee stats
        const filter = { assignedTo: req.user._id };
        const [totalTasks, completedTasks, pendingTasks, inProgressTasks] = await Promise.all([
            Task.countDocuments(filter),
            Task.countDocuments({ ...filter, status: 'Completed' }),
            Task.countDocuments({ ...filter, status: 'Pending' }),
            Task.countDocuments({ ...filter, status: 'In Progress' }),
        ]);

        res.status(200).json({
            success: true,
            stats: { totalTasks, completedTasks, pendingTasks, inProgressTasks },
        });
    }
});

/**
 * @route   GET /api/tasks/employees
 * @desc    Admin: Get list of all employees (for task assignment dropdown)
 * @access  Private (Admin)
 */
const getEmployees = asyncHandler(async (req, res, next) => {
    const employees = await User.find({ role: 'employee' }).select('name email');
    res.status(200).json({ success: true, employees });
});

module.exports = {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getMyTasks,
    updateTaskStatus,
    getDashboardStats,
    getEmployees,
};
