import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, CheckSquare, Users, BarChart3, LogOut, Settings, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/admin/employees', label: 'Employees', icon: Users },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

const employeeLinks = [
    { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employee/tasks', label: 'My Tasks', icon: CheckSquare },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const links = user?.role === 'admin' ? adminLinks : employeeLinks;

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-200 flex flex-col z-40">
            {/* Brand */}
            <div className="px-5 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <Zap size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">TaskMaster</p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Management Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
                    >
                        <Icon size={17} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="px-3 py-4 border-t border-gray-100 space-y-1">
                <button className="nav-item w-full"><Settings size={17} /> Settings</button>
                <button onClick={handleLogout} className="nav-item w-full text-danger-600 hover:bg-danger-50 hover:text-danger-700">
                    <LogOut size={17} /> Log out
                </button>
                <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
                    <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
