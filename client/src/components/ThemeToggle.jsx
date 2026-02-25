import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-90
                       dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-gray-200"
            aria-label="Toggle theme"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    )
}

export default ThemeToggle
