const mongoose = require('mongoose');

/**
 * Task Schema
 * Tasks are created by admins and assigned to employees
 */
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        deadline: {
            type: Date,
            required: [true, 'Deadline is required'],
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Task must be assigned to an employee'],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Optimization: Index for dashboard and employee task list queries
taskSchema.index({ assignedTo: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
