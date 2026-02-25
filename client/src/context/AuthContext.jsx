import { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user')
            if (!saved || saved === 'undefined' || saved === 'null') return null
            const parsed = JSON.parse(saved)
            // Strict ID and Role validation
            if (!parsed?._id || !['admin', 'employee'].includes(parsed?.role)) return null
            return parsed
        } catch { return null }
    })
    const [token, setToken] = useState(() => {
        const saved = localStorage.getItem('token')
        const isValid = saved && saved !== 'null' && saved !== 'undefined'
        return isValid ? saved : null
    })
    const [loading, setLoading] = useState(false)

    const saveSession = (userData, tokenData) => {
        setUser(userData)
        setToken(tokenData)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', tokenData)
    }

    const register = useCallback(async (name, email, password, role) => {
        setLoading(true)
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role })
            saveSession(data.user, data.token)
            toast.success('Account created successfully!')
            return { success: true, role: data.user.role }
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed.'
            toast.error(msg)
            return { success: false }
        } finally { setLoading(false) }
    }, [])

    const login = useCallback(async (email, password) => {
        setLoading(true)
        try {
            const { data } = await api.post('/auth/login', { email, password })
            saveSession(data.user, data.token)
            toast.success(`Welcome back, ${data.user.name}!`)
            return { success: true, role: data.user.role }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid credentials.'
            toast.error(msg)
            return { success: false }
        } finally { setLoading(false) }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        toast.success('Logged out successfully.')
    }, [])

    const isAuthenticated = !!(token && user?._id && ['admin', 'employee'].includes(user?.role))

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            logout,
            register,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
