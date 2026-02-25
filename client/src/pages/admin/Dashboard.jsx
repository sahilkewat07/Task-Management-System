import { useState, useEffect, useCallback } from 'react';
import { ListTodo, Users, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import ActivityTable from '../../components/ActivityTable';
import Loader from '../../components/ui/Loader';

const AdminDashboard = () => {
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
            {/* Page title */}
            <div>
                <h1 className="text-xl font-semibold text-gray-800">
                    Good morning, {user?.name?.split(' ')[0] || 'Admin'} 👋
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Here's what's happening in your workspace today.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="Total Tasks" value={stats?.totalTasks} icon={ListTodo} color="blue" trend={12} onClick={() => navigate('/admin/tasks')} />
                <StatCard title="Completed" value={stats?.completedTasks} icon={CheckCircle2} color="green" trend={5.2} onClick={() => navigate('/admin/tasks')} />
                <StatCard title="Pending" value={stats?.pendingTasks} icon={Clock} color="yellow" trend={-2.4} onClick={() => navigate('/admin/tasks')} />
                <StatCard title="Total Users" value={stats?.totalUsers} icon={Users} color="purple" trend={8} />
            </div>

            {/* Recent task assignments table */}
            <div className="card">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-800">Recent Task Assignments</h2>
                    <div className="flex items-center gap-2">
                        <button className="btn-secondary text-xs py-1.5 px-3">Filter</button>
                        <button className="btn-secondary text-xs py-1.5 px-3">Export</button>
                    </div>
                </div>
                <ActivityTable showAssignee />
            </div>
        </div>
    );
};

export default AdminDashboard;
