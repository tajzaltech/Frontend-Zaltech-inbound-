import { Calendar, CheckCircle2, Clock, XCircle, UserCheck } from 'lucide-react';
import type { AppointmentStats } from '../../types/appointment';

interface AppointmentStatsProps {
  stats: AppointmentStats | null;
}

export const AppointmentStatsCards = ({ stats }: AppointmentStatsProps) => {
  const items = [
    {
      label: 'Today',
      value: stats?.today_count?.toString() || '0',
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'This Week',
      value: stats?.this_week_count?.toString() || '0',
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Confirmed',
      value: stats?.confirmed?.toString() || '0',
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Pending',
      value: stats?.pending?.toString() || '0',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'Completed',
      value: stats?.completed?.toString() || '0',
      icon: UserCheck,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    {
      label: 'Cancelled',
      value: stats?.cancelled?.toString() || '0',
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {items.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-0.5">{stat.value}</h3>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
