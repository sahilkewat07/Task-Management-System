import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Clock, ListTodo, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import ActivityTable from '../../components/ActivityTable';
import Loader from '../../components/ui/Loader';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const { data } = await api.get('/tasks/stats');
            setStats(data?.stats || null);
        } catch (err) { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData() }, [fetchData]);

    const completionRate = stats?.totalTasks > 0
        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
        : 0;

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-800">
                    Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    You have <span className="font-semibold text-gray-700">{stats?.pendingTasks || 0} pending tasks</span> in your queue.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Assigned" value={stats?.totalTasks} icon={ListTodo} color="blue" onClick={() => navigate('/employee/tasks')} />
                <StatCard title="Completed" value={stats?.completedTasks} icon={CheckCircle2} color="green" onClick={() => navigate('/employee/tasks')} />
                <StatCard title="Pending" value={stats?.pendingTasks} icon={Clock} color="yellow" onClick={() => navigate('/employee/tasks')} />
            </div>

            {/* Progress bar */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-semibold text-primary-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-primary-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{stats?.completedTasks || 0} completed</span>
                    <span>{stats?.pendingTasks || 0} remaining</span>
                </div>
            </div>

            {/* My tasks table */}
            <div className="card">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-800">My Tasks</h2>
                    <Link to="/employee/tasks" className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                        View all <ChevronRight size={14} />
                    </Link>
                </div>
                <ActivityTable showAssignee={false} />
            </div>
        </div>
    );
};

export default EmployeeDashboard;
