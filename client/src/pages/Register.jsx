import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await register(form.name, form.email, form.password, form.role);
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
                    <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                    <p className="text-sm text-gray-500 mt-1">Get started with TaskMaster today</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Full name</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" name="name" required value={form.name} onChange={handleChange}
                                    placeholder="Alex Rivera" className="input-field pl-9" />
                            </div>
                        </div>
                        <div>
                            <label className="label">Email address</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" name="email" required value={form.email} onChange={handleChange}
                                    placeholder="you@company.com" className="input-field pl-9" />
                            </div>
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="password" name="password" required value={form.password} onChange={handleChange}
                                    placeholder="••••••••" className="input-field pl-9" />
                            </div>
                        </div>
                        <div>
                            <label className="label">Role</label>
                            <select name="role" value={form.role} onChange={handleChange} className="input-field">
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
                            {loading ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
