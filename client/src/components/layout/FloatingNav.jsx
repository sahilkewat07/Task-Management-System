import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, ListTodo, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FloatingNav = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavItems = () => {
        const baseItems = [
            { path: '/profile', icon: User, label: 'Profile' }
        ];

        if (user?.role === 'admin') {
            return [
                { path: '/admin/dashboard', icon: Home, label: 'Overview' },
                { path: '/admin/tasks', icon: ListTodo, label: 'Tasks' },
                ...baseItems
            ];
        } else {
            return [
                { path: '/employee/dashboard', icon: Home, label: 'Dashboard' },
                { path: '/employee/tasks', icon: ListTodo, label: 'My Tasks' },
                ...baseItems
            ];
        }
    };

    const items = getNavItems();

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 p-2 bg-surface/90 backdrop-blur-2xl border border-zinc-800/80 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-glass-inset">
                {items.map((item) => {
                    const isActive = location.pathname.includes(item.path);
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                                ${isActive ? 'bg-primary-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}
                            `}
                        >
                            <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

                            {/* Tooltip */}
                            <span className="absolute -top-10 scale-0 transition-all rounded-lg bg-zinc-800 p-2 text-xs text-white group-hover:scale-100 shadow-glass border border-zinc-700 font-semibold tracking-wide flex whitespace-nowrap">
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}

                <div className="w-[1px] h-8 bg-zinc-800 mx-1"></div>

                <button
                    onClick={handleLogout}
                    className="group relative flex items-center justify-center w-12 h-12 rounded-full text-zinc-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all duration-300"
                >
                    <LogOut size={20} className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute -top-10 scale-0 transition-all rounded-lg bg-zinc-800 p-2 text-xs text-white group-hover:scale-100 shadow-glass border border-zinc-700 font-semibold tracking-wide flex whitespace-nowrap">
                        Logout
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default FloatingNav;
