import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Strict ID validation to prevent 'null' or 'undefined' string joins
        const validId = user?._id && user?._id !== 'null' && user?._id !== 'undefined';

        if (validId) {
            console.log(`🔌 Initializing socket for: ${user._id}`);
            const newSocket = io('http://localhost:5000');
            setSocket(newSocket);

            newSocket.emit('join', user._id);

            newSocket.on('task_assigned', (data) => {
                setNotifications(prev => [{ id: Date.now(), ...data, read: false }, ...prev]);
                toast.success(data.message, { icon: '📝' });
            });

            newSocket.on('task_status_updated', (data) => {
                setNotifications(prev => [{ id: Date.now(), ...data, read: false }, ...prev]);
                toast.success(data.message, { icon: '✅' });
            });

            return () => newSocket.close();
        }
    }, [user]);

    const markAsRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <SocketContext.Provider value={{ socket, notifications, markAsRead, clearNotifications }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext)
    if (!context) throw new Error('useSocket must be used within SocketProvider')
    return context
};
