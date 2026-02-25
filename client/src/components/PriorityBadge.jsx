import { ChevronsUp, ChevronUp, Minus } from 'lucide-react'

const PriorityBadge = ({ priority }) => {
    const config = {
        'High': {
            label: 'High',
            icon: ChevronsUp,
            className: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
        },
        'Medium': {
            label: 'Medium',
            icon: ChevronUp,
            className: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
        },
        'Low': {
            label: 'Low',
            icon: Minus,
            className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700'
        }
    }

    const current = config[priority] || config['Medium']
    const Icon = current.icon

    return (
        <span className={`badge-base !rounded-lg ${current.className}`}>
            <Icon size={12} className="stroke-[3]" />
            {current.label}
        </span>
    )
}

export default PriorityBadge
