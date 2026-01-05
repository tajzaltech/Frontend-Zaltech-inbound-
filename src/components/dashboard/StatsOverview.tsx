import { Phone, Clock } from 'lucide-react';
import type { DashboardStats } from '../../api/stats';

interface StatsOverviewProps {
    stats: DashboardStats | null;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
    const formatDuration = (seconds: number) => {
        if (!seconds) return '0m 0s';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const items = [
        {
            label: 'Total Calls Today',
            value: stats?.totalCallsToday.toString() || '0',
            change: stats?.callsTrend || '',
            isPositive: !stats?.callsTrend?.includes('-'),
            icon: Phone,
            color: 'text-red-600',
            bg: 'bg-red-50'
        },
        {
            label: 'Avg Duration',
            value: formatDuration(stats?.avgDurationSec || 0),
            change: stats?.durationTrend || '',
            isPositive: !stats?.durationTrend?.includes('+'), // shorter is usually better
            icon: Clock,
            color: 'text-red-600',
            bg: 'bg-red-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {items.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        {stat.change && (
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                {stat.change}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
