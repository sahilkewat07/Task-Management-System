import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Modal from './ui/Modal';
import AnimatedInput from './ui/AnimatedInput';
import GradientButton from './ui/GradientButton';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];

const TaskModal = ({ isOpen, onClose, onSuccess, editTask = null }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', priority: 'Medium',
        deadline: '', assignedTo: '', status: 'Pending',
    });

    useEffect(() => {
        if (editTask) {
            setForm({
                title: editTask.title || '',
                description: editTask.description || '',
                priority: editTask.priority || 'Medium',
                deadline: editTask.deadline ? editTask.deadline.substring(0, 10) : '',
                assignedTo: editTask.assignedTo?._id || '',
                status: editTask.status || 'Pending',
            });
        } else {
            setForm({ title: '', description: '', priority: 'Medium', deadline: '', assignedTo: '', status: 'Pending' });
        }
    }, [editTask, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        api.get('/tasks/employees')
            .then(({ data }) => setEmployees(data.employees || []))
            .catch(() => toast.error('Could not load employees'));
    }, [isOpen]);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.deadline || !form.assignedTo) {
            toast.error('Title, deadline and assignee are required');
            return;
        }
        setLoading(true);
        try {
            if (editTask) {
                await api.put(`/tasks/${editTask._id}`, form);
                toast.success('Task updated');
            } else {
                await api.post('/tasks', form);
                toast.success('Task created');
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save task');
        } finally { setLoading(false); }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editTask ? 'Edit Task' : 'Create New Task'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatedInput label="Task Title" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. Implement Auth API" />

                <div className="flex flex-col mb-4">
                    <label className="label">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                        className="input-field resize-none" placeholder="Describe the task..." />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col mb-4">
                        <label className="label">Assign To</label>
                        <select name="assignedTo" required value={form.assignedTo} onChange={handleChange} className="input-field">
                            <option value="">Select employee</option>
                            {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                        </select>
                    </div>
                    <AnimatedInput type="date" label="Deadline" name="deadline" required value={form.deadline} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col mb-4">
                        <label className="label">Priority</label>
                        <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="label">Status</label>
                        <select name="status" value={form.status} onChange={handleChange} className="input-field">
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <GradientButton variant="secondary" type="button" onClick={onClose} disabled={loading}>Cancel</GradientButton>
                    <GradientButton variant="primary" type="submit" isLoading={loading}>
                        {editTask ? 'Save Changes' : 'Create Task'}
                    </GradientButton>
                </div>
            </form>
        </Modal>
    );
};

export default TaskModal;
