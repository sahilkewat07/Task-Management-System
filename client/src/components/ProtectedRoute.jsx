import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protects routes requiring authentication.
 * Optionally restrict by role: <ProtectedRoute role="admin" />
 */
const ProtectedRoute = ({ role }) => {
    const { isAuthenticated, user } = useAuth()

    if (!isAuthenticated || !user || !user.role) {
        console.warn('ProtectedRoute: Missing credentials or role. Redirecting to login.')
        return <Navigate to="/login" replace />
    }

    // Role-based authorization
    if (role && user.role !== role) {
        console.warn(`Auth: Role mismatch. Required: ${role}, User has: ${user.role}`)

        // Final fallback if role is completely missing or invalid
        if (!user.role) return <Navigate to="/login" replace />

        const target = user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'

        // CRITICAL: Prevent circular redirect to the same page
        if (window.location.pathname === target) {
            console.error("Auth: Circular redirect detected. Forcing logout.")
            return <Navigate to="/login" replace />
        }

        return <Navigate to={target} replace />
    }

    return <Outlet />
}

export default ProtectedRoute
