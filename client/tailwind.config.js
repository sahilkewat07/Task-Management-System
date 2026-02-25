/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
                success: {
                    50: '#f0fdf4',
                    500: '#22c55e',
                    600: '#16a34a',
                },
                warning: {
                    50: '#fffbeb',
                    500: '#f59e0b',
                    600: '#d97706',
                },
                danger: {
                    50: '#fff1f2',
                    500: '#ef4444',
                    600: '#dc2626',
                },
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
                'card-md': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
                'card-lg': '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'slide-up': 'slideUp 0.35s ease-out forwards',
                'scale-in': 'scaleIn 0.2s ease-out forwards',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
                slideUp: { '0%': { transform: 'translateY(16px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
                scaleIn: { '0%': { transform: 'scale(0.95)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
            },
        },
    },
    plugins: [],
}
