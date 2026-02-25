import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TaskModal from './TaskModal';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user } = useAuth();
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar: always on lg+, drawer on mobile */}
            <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <Sidebar />
            </div>

            {/* Main column */}
            <div className="flex flex-col flex-1 min-w-0 lg:pl-56">
                <Navbar
                    toggleSidebar={() => setSidebarOpen(o => !o)}
                    onCreateTask={user?.role === 'admin' ? () => setShowTaskModal(true) : undefined}
                />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>

            {showTaskModal && (
                <TaskModal
                    isOpen={showTaskModal}
                    onClose={() => setShowTaskModal(false)}
                    onSuccess={() => setShowTaskModal(false)}
                />
            )}
        </div>
    );
};

export default Layout;
