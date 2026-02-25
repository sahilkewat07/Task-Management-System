import { CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react'

const StatusBadge = ({ status }) => {
    const config = {
        'Pending': {
            label: 'Pending',
            icon: Clock,
            className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700'
        },
        'In Progress': {
            label: 'In Progress',
            icon: PlayCircle,
            className: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20'
        },
        'Completed': {
            label: 'Completed',
            icon: CheckCircle2,
            className: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
        },
        'Overdue': {
            label: 'Overdue',
            icon: AlertCircle,
            className: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
        }
    }

    const current = config[status] || config['Pending']
    const Icon = current.icon

    return (
        <span className={`badge-base ${current.className}`}>
            <Icon size={14} className="stroke-[2.5]" />
            {current.label}
        </span>
    )
}

export default StatusBadge
