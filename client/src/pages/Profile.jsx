import { useState, useRef } from 'react'
import { Camera, User, Mail, Shield, Save, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const Profile = () => {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef()

    const [name, setName] = useState(user?.name || '')
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setPreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append('name', name)
        if (selectedFile) formData.append('avatar', selectedFile)

        try {
            const res = await api.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setUser(res.data.user)
            toast.success('Profile synchronized successfully', {
                icon: <CheckCircle2 className="text-emerald-500" size={20} />
            })
            setSelectedFile(null)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Sync failed')
        } finally {
            setLoading(false)
        }
    }

    const avatarUrl = preview || (user?.avatar ? `http://localhost:5000${user.avatar}` : null)

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
            {/* Header Area */}
            <div className="flex items-center gap-6 mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 hover:bg-white dark:hover:bg-slate-900 rounded-2xl transition-all text-gray-400 group border border-transparent hover:border-gray-100 dark:hover:border-slate-800 shadow-sm"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Account Flux</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold mt-1">Manage your digital identity and preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Col: Photo */}
                <div className="lg:col-span-1">
                    <div className="card bg-white dark:bg-slate-900 border-none p-10 flex flex-col items-center text-center">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-500/10 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center transition-transform hover:scale-105">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-indigo-600 dark:text-indigo-400" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all ring-4 ring-white dark:ring-slate-950"
                            >
                                <Camera size={20} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{user?.name}</h3>
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 inline-block">
                                {user?.role} Access
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Fields */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="card bg-white dark:bg-slate-900 border-none p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="label">Display Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="input-field pl-12"
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 opacity-60">
                                    <label className="label">Email Address (Read-only)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={user?.email}
                                            className="input-field pl-12 bg-gray-50 dark:bg-slate-950 cursor-not-allowed"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 opacity-60">
                                <label className="label">System Permissions</label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={user?.role}
                                        className="input-field pl-12 bg-gray-50 dark:bg-slate-950 cursor-not-allowed capitalize"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-6">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-secondary"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary min-w-[200px]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Commit Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile
