import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Auth Pages
import Login from './pages/Login'
import Register from './pages/Register'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminTasks from './pages/admin/Tasks'

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard'
import MyTasks from './pages/employee/MyTasks'

import Profile from './pages/Profile'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

const App = () => {
    const { isAuthenticated, user } = useAuth()

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!(isAuthenticated && user?.role) ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />} />
            <Route path="/register" element={!(isAuthenticated && user?.role) ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />} />

            {/* Shared Protected Routes (Wrapped in Layout) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
                <Route element={<Layout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/tasks" element={<AdminTasks />} />
                </Route>
            </Route>

            {/* Employee Protected Routes */}
            <Route element={<ProtectedRoute role="employee" />}>
                <Route element={<Layout />}>
                    <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                    <Route path="/employee/tasks" element={<MyTasks />} />
                </Route>
            </Route>

            {/* Default Redirect */}
            <Route
                path="/"
                element={
                    isAuthenticated && user?.role
                        ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />
                        : <Navigate to="/login" replace />
                }
            />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
