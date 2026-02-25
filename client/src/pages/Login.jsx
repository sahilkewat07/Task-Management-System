import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(form.email, form.password);
            if (result.success) navigate('/');
        } catch (err) { }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-11 h-11 bg-primary-600 rounded-xl mb-4">
                        <Zap size={22} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Sign in to TaskMaster</h1>
                    <p className="text-sm text-gray-500 mt-1">Enter your credentials to continue</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Email address</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email" name="email" required
                                    value={form.email} onChange={handleChange}
                                    placeholder="you@company.com"
                                    className="input-field pl-9"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password" name="password" required
                                    value={form.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input-field pl-9"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">Create account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
