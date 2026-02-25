import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <SocketProvider>
                        <App />
                    </SocketProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            className: 'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800',
                            style: {
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '600',
                            },
                        }}
                    />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
)
