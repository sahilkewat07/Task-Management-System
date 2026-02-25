import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, Pencil, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import api from '../../services/api';
import TaskModal from '../../components/TaskModal';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const priorityBadge = (p) => {
    const map = {
        High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low',
    };
    return <span className={map[p] || 'badge-low'}>{p}</span>;
};

const statusDot = (s) => {
    const dots = { 'Completed': 'bg-green-500', 'In Progress': 'bg-blue-500', 'Pending': 'bg-gray-300' };
    return (
        <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`w-2 h-2 rounded-full ${dots[s] || 'bg-gray-300'}`} />
            {s}
        </span>
    );
};

const AdminTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, taskId: null, loading: false });

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try { const { data } = await api.get('/tasks'); setTasks(data.tasks); }
        catch { toast.error('Failed to load tasks.'); }
        finally { setLoading(false); }
    }, []);

    const fetchEmployees = useCallback(async () => {
        try { const { data } = await api.get('/tasks/employees'); setEmployees(data.employees || []); }
        catch { }
    }, []);

    useEffect(() => { fetchTasks(); fetchEmployees(); }, [fetchTasks, fetchEmployees]);

    const handleDelete = async () => {
        setDeleteConfig(p => ({ ...p, loading: true }));
        try {
            await api.delete(`/tasks/${deleteConfig.taskId}`);
            setTasks(p => p.filter(t => t._id !== deleteConfig.taskId));
            toast.success('Task deleted');
        } catch { toast.error('Failed to delete task'); }
        finally { setDeleteConfig({ isOpen: false, taskId: null, loading: false }); }
    };

    const handleInlineUpdate = async (taskId, field, value) => {
        setUpdating(taskId);
        try {
            await api.put(`/tasks/${taskId}`, { [field]: value });
            if (field === 'assignedTo') {
                const emp = employees.find(e => e._id === value);
                setTasks(p => p.map(t => t._id === taskId ? { ...t, assignedTo: emp } : t));
            } else {
                setTasks(p => p.map(t => t._id === taskId ? { ...t, [field]: value } : t));
            }
        } catch { toast.error(`Failed to update task`); }
        finally { setUpdating(null); }
    };

    const filtered = tasks.filter(t => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.assignedTo?.name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || t.status === filterStatus;
        const matchPriority = !filterPriority || t.priority === filterPriority;
        return matchSearch && matchStatus && matchPriority;
    });

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">Task Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{tasks.length} tasks total</p>
                </div>
                <button onClick={() => { setEditTask(null); setIsModalOpen(true); }} className="btn-primary">
                    <Plus size={16} strokeWidth={2.5} /> New Task
                </button>
            </div>

            {/* Filters */}
            <div className="card p-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Search tasks or assignees..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field pl-9 !py-2 text-sm"
                    />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field !py-2 text-sm w-auto">
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input-field !py-2 text-sm w-auto">
                    <option value="">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <button onClick={fetchTasks} className="btn-secondary !py-2 !px-3">
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <Filter size={32} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No tasks match your filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(task => (
                                    <tr key={task._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-3.5">
                                            <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{task.title}</p>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                                                    {task.assignedTo?.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <select
                                                    value={task.assignedTo?._id || ''}
                                                    onChange={e => handleInlineUpdate(task._id, 'assignedTo', e.target.value)}
                                                    disabled={updating === task._id}
                                                    className="text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer border-0 p-0"
                                                >
                                                    {task.assignedTo && !employees.find(e => e._id === task.assignedTo._id) && (
                                                        <option value={task.assignedTo._id}>{task.assignedTo.name}</option>
                                                    )}
                                                    {employees.map(emp => (
                                                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">{priorityBadge(task.priority)}</td>
                                        <td className="px-6 py-3.5 text-sm text-gray-600">
                                            {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <select
                                                value={task.status}
                                                onChange={e => handleInlineUpdate(task._id, 'status', e.target.value)}
                                                disabled={updating === task._id}
                                                className="text-sm bg-transparent focus:outline-none cursor-pointer border-0 p-0 text-gray-600"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                            {updating === task._id && <Loader2 size={12} className="inline-block ml-1 animate-spin text-primary-500" />}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setEditTask(task); setIsModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => setDeleteConfig({ isOpen: true, taskId: task._id, loading: false })} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchTasks} editTask={editTask} />
            <ConfirmModal
                isOpen={deleteConfig.isOpen}
                onClose={() => setDeleteConfig({ isOpen: false, taskId: null, loading: false })}
                onConfirm={handleDelete}
                loading={deleteConfig.loading}
                title="Delete Task?"
                message="This will permanently delete the task. This cannot be undone."
                confirmLabel="Delete"
            />
        </div>
    );
};

export default AdminTasks;
