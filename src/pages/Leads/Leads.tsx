import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { leadsApi } from '../../api/leads';
import { Header } from '../../components/layout/Header';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { format } from 'date-fns';
import { Phone, Calendar, Mail } from 'lucide-react';

export function Leads() {
    const navigate = useNavigate();

    const { data: leads = [], isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: leadsApi.getLeads,
    });

    if (isLoading) {
        return (
            <div className="flex-1 h-full">
                <Header title="Leads Board" />
                <div className="p-8">
                    <div className="text-center text-gray-500 py-12">Loading...</div>
                </div>
            </div>
        );
    }

    const columns = [
        { id: 'NEW', label: 'New Leads', color: 'bg-blue-50 text-blue-700' },
        { id: 'FOLLOW_UP', label: 'Follow Up', color: 'bg-yellow-50 text-yellow-700' },
        { id: 'BOOKED', label: 'Booked / Closed', color: 'bg-green-50 text-green-700' }
    ];

    const getLeadsByStatus = (status: string) => {
        return leads.filter(lead => {
            if (status === 'BOOKED') return lead.status === 'BOOKED' || lead.status === 'COMPLETED';
            if (status === 'NEW') return lead.status === 'NEW';
            return lead.status === 'FOLLOW_UP';
        });
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header title="Leads Board" />

            <div className="flex-1 p-4 lg:p-8 overflow-x-auto overflow-y-hidden">
                <div className="flex h-full gap-6 min-w-[1000px]">
                    {columns.map(column => (
                        <div key={column.id} className="flex-1 flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100 h-full max-h-full">
                            {/* Column Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-gray-50/90 backdrop-blur-sm rounded-t-2xl z-10">
                                <h3 className="font-semibold text-gray-700">{column.label}</h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${column.color}`}>
                                    {getLeadsByStatus(column.id).length}
                                </span>
                            </div>

                            {/* Cards Area */}
                            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                                {getLeadsByStatus(column.id).map(lead => (
                                    <div
                                        key={lead.id}
                                        onClick={() => navigate(`/leads/${lead.id}`)}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-red-100 transition-all group active:scale-[0.98]"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">{lead.name}</h4>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                                    <Phone className="w-3 h-3" />
                                                    {lead.phone}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                                    <Mail className="w-3 h-3" />
                                                    {lead.email}
                                                </div>
                                            </div>
                                            <StatusBadge status={lead.status} />
                                        </div>

                                        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                            <div className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                                {lead.serviceInterest || 'General'}
                                            </div>
                                            {lead.lastCallAt && (
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(lead.lastCallAt, 'MMM dd')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {getLeadsByStatus(column.id).length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                                        <p className="text-xs text-gray-400">No leads</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
