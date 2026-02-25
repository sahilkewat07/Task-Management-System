import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import api from '../services/api';

const priorityBadge = (p) => {
    const map = {
        High: 'badge-high',
        Medium: 'badge-medium',
        Low: 'badge-low',
        Critical: 'badge-critical',
    };
    return <span className={map[p] || 'badge-low'}>{p}</span>;
};

const statusDot = (s) => {
    const dots = {
        'Completed': 'bg-green-500',
        'In Progress': 'bg-blue-500',
        'Pending': 'bg-gray-300',
        'To Do': 'bg-gray-200',
    };
    return (
        <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`w-2 h-2 rounded-full shrink-0 ${dots[s] || 'bg-gray-300'}`} />
            {s}
        </span>
    );
};

const RowSkeleton = () => (
    <tr className="border-b border-gray-50 animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-40" /></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-28" /></td>
        <td className="px-6 py-4"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
        <td className="px-6 py-4"><div className="h-5 w-5 bg-gray-100 rounded ml-auto" /></td>
    </tr>
);

/**
 * ActivityTable — renders a task list in the dashboard "Recent Task Assignments" style.
 *
 * Props:
 *   tasks      — optional pre-loaded tasks array; if omitted, fetches via API
 *   loading    — optional external loading state
 *   showAssignee — show the "Assigned To" column (default true)
 *   endpoint   — API endpoint to use when self-fetching (default '/tasks')
 *   limit      — max rows to show when self-fetching (default 8)
 */
const ActivityTable = ({
    tasks: propTasks,
    loading: propLoading,
    showAssignee = true,
    endpoint = '/tasks',
    limit = 8,
}) => {
    const [tasks, setTasks] = useState(propTasks || []);
    const [loading, setLoading] = useState(propLoading !== undefined ? propLoading : !propTasks);

    useEffect(() => {
        if (propTasks !== undefined) {
            setTasks(propTasks);
            setLoading(false);
            return;
        }
        let cancelled = false;
        setLoading(true);
        api.get(endpoint)
            .then(({ data }) => {
                if (!cancelled) {
                    const list = data.tasks || data || [];
                    setTasks(list.slice(0, limit));
                    setLoading(false);
                }
            })
            .catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [endpoint, limit, propTasks]);

    if (!loading && tasks.length === 0) {
        return (
            <div className="py-16 text-center">
                <p className="text-sm text-gray-400">No tasks found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                        {showAssignee && (
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
                        )}
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        [...Array(5)].map((_, i) => <RowSkeleton key={i} />)
                    ) : (
                        tasks.map(task => (
                            <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">{task.title}</p>
                                        {task.description && (
                                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{task.description}</p>
                                        )}
                                    </div>
                                </td>
                                {showAssignee && (
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                                                {task.assignedTo?.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <span className="text-sm text-gray-700">{task.assignedTo?.name || '—'}</span>
                                        </div>
                                    </td>
                                )}
                                <td className="px-6 py-4">{priorityBadge(task.priority)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {task.deadline
                                        ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                        : '—'}
                                </td>
                                <td className="px-6 py-4">{statusDot(task.status)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityTable;
