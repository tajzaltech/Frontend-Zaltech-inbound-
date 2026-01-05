import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsApi } from '../../api/leads';
import { callsApi } from '../../api/calls';
import { Header } from '../../components/layout/Header';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ArrowLeft, Phone, Calendar, Mail, Sparkles, CheckCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { TranscriptStream } from '../../components/TranscriptStream/TranscriptStream';

export function LeadDetail() {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();

    const { data: lead, isLoading: isLeadLoading } = useQuery({
        queryKey: ['lead', leadId],
        queryFn: () => leadsApi.getLeadById(leadId!),
        enabled: !!leadId,
    });

    const recentCallId = lead?.relatedCalls?.[0];

    const { data: recentCall, isLoading: isCallLoading } = useQuery({
        queryKey: ['call', recentCallId],
        queryFn: () => callsApi.getCallById(recentCallId!),
        enabled: !!recentCallId,
    });

    const isLoading = isLeadLoading || (!!recentCallId && isCallLoading);

    if (isLoading || !lead) {
        return (
            <div className="flex-1">
                <Header title="Lead Detail" />
                <div className="p-6">
                    <div className="text-center text-gray-500 py-12">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header
                title="Lead Detail"
                actions={
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-outline flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                }
            />

            <div className="flex-1 p-8 overflow-auto">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="card">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                            <div className="min-w-0">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 truncate">{lead.name}</h2>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-red-500" />
                                        <span className="font-medium">{lead.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-red-500" />
                                        <span className="font-medium underline decoration-red-500/20 underline-offset-4">{lead.email}</span>
                                    </div>
                                    {lead.lastCallAt && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
                                            <Calendar className="w-4 h-4 text-red-500" />
                                            <span>Last call {format(new Date(lead.lastCallAt), 'MMM dd, HH:mm')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="shrink-0 self-start">
                                <StatusBadge status={lead.status} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 hover:bg-white hover:shadow-sm transition-all duration-300">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Info className="w-3 h-3" />
                                    Service Interest
                                </div>
                                <div className="font-semibold text-gray-900">{lead.serviceInterest || '—'}</div>
                            </div>
                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 hover:bg-white hover:shadow-sm transition-all duration-300">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    Account Created
                                </div>
                                <div className="font-semibold text-gray-900">{format(new Date(lead.createdAt), 'MMM dd, yyyy')}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-section-title mb-3">Notes</h3>
                        <p className="text-body text-gray-600">
                            {lead.notes || 'No automatic summary generated yet...'}
                        </p>
                    </div>

                    {/* Recent Transcript Section */}
                    {recentCall && (
                        <div className="card flex flex-col h-[500px]">
                            <h3 className="text-section-title mb-4 flex items-center gap-2 flex-shrink-0">
                                <Phone className="w-4 h-4 text-gray-400" />
                                Recent Call Transcript
                            </h3>
                            <div className="bg-gray-50/50 rounded-xl border border-gray-100 flex-1 overflow-hidden relative">
                                <div className="absolute inset-0">
                                    <TranscriptStream transcript={recentCall.transcript} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card">
                        <h3 className="text-section-title mb-6">Audit Log</h3>
                        <div className="relative space-y-0">
                            {/* Vertical Line */}
                            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                            {lead.auditLog.map((entry) => {
                                const getIcon = () => {
                                    switch (entry.type) {
                                        case 'call': return <Phone className="w-3.5 h-3.5" />;
                                        case 'ai': return <Sparkles className="w-3.5 h-3.5" />;
                                        case 'status': return <CheckCircle className="w-3.5 h-3.5" />;
                                        case 'appointment': return <Calendar className="w-3.5 h-3.5" />;
                                        default: return <Info className="w-3.5 h-3.5" />;
                                    }
                                };

                                const getTypeStyles = () => {
                                    switch (entry.type) {
                                        case 'call': return 'bg-blue-50 text-blue-600 border-blue-100';
                                        case 'ai': return 'bg-purple-50 text-purple-600 border-purple-100';
                                        case 'status': return 'bg-green-50 text-green-600 border-green-100';
                                        case 'appointment': return 'bg-orange-50 text-orange-600 border-orange-100';
                                        default: return 'bg-gray-50 text-gray-600 border-gray-100';
                                    }
                                };

                                return (
                                    <div key={entry.id} className="relative flex gap-6 pb-8 last:pb-2 group">
                                        <div className={`
                                            relative z-10 w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center flex-shrink-0
                                            ${getTypeStyles().split(' ').slice(1).join(' ')}
                                        `}>
                                            <div className={`w-full h-full rounded-full flex items-center justify-center ${getTypeStyles().split(' ')[0]}`}>
                                                {getIcon()}
                                            </div>
                                        </div>

                                        <div className="flex-1 pt-0.5">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900">{entry.action}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold ${getTypeStyles()}`}>
                                                        {entry.type || 'system'}
                                                    </span>
                                                </div>
                                                <span className="text-meta text-gray-400 group-hover:text-gray-500 transition-colors">
                                                    {format(entry.timestamp, 'MMM dd, HH:mm')}
                                                </span>
                                            </div>
                                            <p className="text-body text-gray-600 leading-relaxed">{entry.details}</p>
                                            <div className="mt-2 flex items-center gap-1.5">
                                                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 uppercase">
                                                    {entry.user.charAt(0)}
                                                </div>
                                                <span className="text-meta text-gray-400">Action by {entry.user}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {lead.auditLog.length === 0 && (
                                <div className="text-center py-8 text-gray-400 italic">
                                    No activity recorded yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
