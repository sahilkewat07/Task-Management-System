import { PlusCircle } from 'lucide-react'

const EmptyState = ({ title, message, actionLabel, onAction }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
            <div className="w-24 h-24 bg-gray-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 border border-gray-100 dark:border-slate-800">
                <PlusCircle size={40} className="text-gray-300 dark:text-slate-700" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto mb-8">
                {message}
            </p>
            {onAction && (
                <button
                    onClick={onAction}
                    className="btn-primary"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    )
}

export default EmptyState
