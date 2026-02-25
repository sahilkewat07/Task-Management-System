/**
 * TaskBadge — color-coded badge for task status or priority
 */
const statusStyles = {
    'Pending': 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
    'In Progress': 'bg-sky-500/15 text-sky-400 ring-sky-500/30',
    'Completed': 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
}

const priorityStyles = {
    'Low': 'bg-slate-500/15 text-slate-400 ring-slate-500/30',
    'Medium': 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
    'High': 'bg-red-500/15 text-red-400 ring-red-500/30',
}

const TaskBadge = ({ type = 'status', value }) => {
    const styles = type === 'priority' ? priorityStyles : statusStyles
    const cls = styles[value] || 'bg-slate-700 text-slate-300'

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${cls}`}>
            {value}
        </span>
    )
}

export default TaskBadge
