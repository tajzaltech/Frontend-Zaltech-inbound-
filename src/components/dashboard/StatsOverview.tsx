import { Phone, TrendingUp, Users, Clock } from 'lucide-react';

export function StatsOverview() {
    const stats = [
        {
            label: 'Total Calls Today',
            value: '128',
            change: '+12%',
            isPositive: true,
            icon: Phone,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Active Agents',
            value: '8',
            change: 'Full Capacity',
            isPositive: true,
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            label: 'Avg Duration',
            value: '4m 32s',
            change: '-8%',
            isPositive: true, // shorter duration can be good
            icon: Clock,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            label: 'Customer Sentiment',
            value: '4.8',
            change: '+0.4',
            isPositive: true,
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 lg:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
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
