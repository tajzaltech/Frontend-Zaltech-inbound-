import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { leadsApi } from '../../api/leads';
import { Header } from '../../components/layout/Header';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { format } from 'date-fns';

export function Leads() {
    const navigate = useNavigate();

    const { data: leads = [], isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: leadsApi.getLeads,
    });

    if (isLoading) {
        return (
            <div className="flex-1 h-full">
                <Header title="Leads" />
                <div className="p-8">
                    <div className="text-center text-gray-500 py-12">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header title="Leads" />

            <div className="flex-1 p-4 lg:p-8 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="card overflow-hidden !p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Service Interest
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Last Call
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {leads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            onClick={() => navigate(`/leads/${lead.id}`)}
                                            className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                                        >
                                            <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                                {lead.name}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {lead.phone}
                                            </td>
                                            <td className="py-4 px-6">
                                                <StatusBadge status={lead.status} />
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {lead.serviceInterest || '—'}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">
                                                {lead.lastCallAt ? format(lead.lastCallAt, 'MMM dd, HH:mm') : '—'}
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
