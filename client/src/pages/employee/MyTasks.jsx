import { useState, useEffect, useCallback } from 'react';
import { Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const STATUSES = ['Pending', 'In Progress', 'Completed'];

const priorityBadge = (p) => {
    const map = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
    return <span className={map[p] || 'badge-low'}>{p}</span>;
};

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try { const { data } = await api.get('/tasks/my'); setTasks(data.tasks); }
        catch { toast.error('Failed to load tasks'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchTasks() }, [fetchTasks]);

    const handleStatusChange = async (taskId, newStatus) => {
        setUpdating(taskId);
        try {
            await api.put(`/tasks/${taskId}/status`, { status: newStatus });
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            toast.success('Status updated');
        } catch { toast.error('Update failed'); }
        finally { setUpdating(null); }
    };

    const filtered = tasks.filter(t => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || t.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const isOverdue = (deadline) => deadline && new Date(deadline) < new Date();

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-4 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-800">My Tasks</h1>
                <p className="text-sm text-gray-500 mt-0.5">{tasks.length} tasks assigned to you</p>
            </div>

            {/* Filters */}
            <div className="card p-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field pl-9 !py-2 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['', ...STATUSES].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s
                                ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            {s || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task grid */}
            {filtered.length === 0 ? (
                <div className="card py-16 text-center">
                    <CheckCircle2 size={36} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No tasks match your filters</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map(task => {
                        const overdue = isOverdue(task.deadline) && task.status !== 'Completed';
                        return (
                            <div
                                key={task._id}
                                className={`card p-5 flex flex-col h-full ${overdue ? 'border-red-200' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    {priorityBadge(task.priority)}
                                    {overdue && (
                                        <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                            <AlertCircle size={12} /> Overdue
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-sm font-semibold text-gray-800 mb-2">{task.title}</h3>
                                <p className="text-xs text-gray-500 flex-1 mb-4 line-clamp-2">
                                    {task.description || 'No description provided.'}
                                </p>

                                <div className="mt-auto space-y-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>Deadline</span>
                                        <span className={overdue ? 'text-red-500 font-medium' : 'text-gray-600 font-medium'}>
                                            {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <select
                                            value={task.status}
                                            disabled={updating === task._id}
                                            onChange={e => handleStatusChange(task._id, e.target.value)}
                                            className="input-field !py-1.5 text-xs flex-1"
                                        >
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        {updating === task._id && <Loader2 size={14} className="animate-spin text-primary-500 shrink-0" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyTasks;
