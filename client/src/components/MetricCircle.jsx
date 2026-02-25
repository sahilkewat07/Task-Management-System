import React from 'react';

/**
 * SVG-based circular progress visualization for efficiency metrics.
 * Extracted from dashboard pages to ensure DRY and A11y.
 */
const MetricCircle = ({
    percent = 0,
    label = "Goal",
    size = 192, // w-48
    strokeWidth = 12
}) => {
    const radius = (size / 2) - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * percent) / 100;

    return (
        <div className="relative flex flex-col items-center justify-center" role="img" aria-label={`Efficiency rating: ${percent}%`}>
            <div className={`relative`} style={{ width: size, height: size }}>
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-gray-100 dark:text-slate-800"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        style={{
                            strokeDashoffset: isNaN(offset) ? circumference : offset,
                            transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        strokeLinecap="round"
                        className="text-indigo-600 dark:text-indigo-500"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{percent}%</span>
                    <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">{label}</span>
                </div>
            </div>
        </div>
    );
};

export default MetricCircle;
