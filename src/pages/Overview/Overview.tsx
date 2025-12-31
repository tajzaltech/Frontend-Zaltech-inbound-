import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { leadsApi } from '../../api/leads';
import { Header } from '../../components/layout/Header';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StatsOverview } from '../../components/dashboard/StatsOverview';
import { CallVolumeChart } from '../../components/dashboard/CallVolumeChart';
import { Phone, Clock, ArrowRight, User, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Overview() {
    const navigate = useNavigate();

    const { data: leads = [] } = useQuery({
        queryKey: ['leads'],
        queryFn: leadsApi.getLeads,
    });

    // Get recent leads (last 5)
    const recentLeads = [...leads].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header title="Overview" />

            <div className="flex-1 p-4 lg:p-8 overflow-auto">
                <StatsOverview />
                <CallVolumeChart />

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Recent Leads</h2>
                        <button
                            onClick={() => navigate('/leads')}
                            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 group"
                        >
                            View All Leads
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Lead Name</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Service Interest</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="text-right py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentLeads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            onClick={() => navigate(`/leads/${lead.id}`)}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{lead.name}</div>
                                                        <div className="text-xs text-gray-400">{lead.phone}</div>
                                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                                                            <Mail className="w-3 h-3" />
                                                            {lead.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-600">{lead.serviceInterest}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <StatusBadge status={lead.status} />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="text-gray-400 group-hover:text-red-600 transition-colors">
                                                    <ArrowRight className="w-4 h-4 ml-auto" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
