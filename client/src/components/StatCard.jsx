import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-500', border: 'border-green-100' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-500', border: 'border-yellow-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-500', border: 'border-purple-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-500', border: 'border-red-100' },
};

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, trend, onClick }) => {
    const c = colorMap[color] || colorMap.blue;
    const isPositive = trend >= 0;

    return (
        <div
            onClick={onClick}
            className={`card p-5 ${onClick ? 'cursor-pointer hover:shadow-card-md transition-shadow duration-200' : ''}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
                    <Icon size={20} className={c.icon} />
                </div>
                {trend !== undefined && (
                    <span className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {isPositive ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">{value ?? '—'}</p>
                <p className="text-sm text-gray-500 mt-1">{title}</p>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
};

export default StatCard;
