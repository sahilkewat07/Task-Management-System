import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Search, Plus, Trash2, Check, Clock, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

const Navbar = ({ toggleSidebar, onCreateTask }) => {
    const { user } = useAuth()
    const { notifications, markAsRead, clearNotifications } = useSocket()
    const navigate = useNavigate()
    const [showNotifications, setShowNotifications] = useState(false)
    const notificationRef = useRef()
    const unreadCount = notifications.filter(n => !n.read).length

    useEffect(() => {
        const fn = (e) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target))
                setShowNotifications(false)
        }
        document.addEventListener('mousedown', fn)
        return () => document.removeEventListener('mousedown', fn)
    }, [])

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
            {/* Left: mobile hamburger + search */}
            <div className="flex items-center gap-3 flex-1">
                <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-gray-100 lg:hidden text-gray-500">
                    <Menu size={20} />
                </button>
                <div className="relative hidden sm:block w-72">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks, employees, or files..."
                        className="input-field pl-9 !py-2 text-sm"
                    />
                </div>
            </div>

            {/* Right: bell + create button */}
            <div className="flex items-center gap-3">
                {/* Notification bell */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <Bell size={19} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-card-lg z-50 overflow-hidden animate-scale-in">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Notifications</span>
                                <button onClick={clearNotifications} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <Check size={24} className="text-gray-300 mx-auto mb-2" />
                                        <p className="text-xs text-gray-400">All caught up!</p>
                                    </div>
                                ) : notifications.map(n => (
                                    <div key={n.id} onClick={() => markAsRead(n.id)}
                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${!n.read ? 'bg-primary-50/50' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-primary-500' : 'bg-transparent'}`} />
                                            <div>
                                                <p className="text-sm text-gray-700">{n.message}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock size={10} className="text-gray-400" />
                                                    <span className="text-xs text-gray-400">Just now</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Create button — only shown to admin */}
                {user?.role === 'admin' && (
                    <button
                        onClick={onCreateTask}
                        className="btn-primary gap-1.5"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Create New Task
                    </button>
                )}
            </div>
        </header>
    )
}

export default Navbar
