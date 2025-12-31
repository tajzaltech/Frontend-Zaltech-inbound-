
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsApi } from '../../api/leads';
import { callsApi } from '../../api/calls';
import { Header } from '../../components/layout/Header';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ArrowLeft, Phone, Calendar, Mail } from 'lucide-react';
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
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-page-title mb-2">{lead.name}</h2>
                                <div className="flex items-center gap-4 text-body text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {lead.phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {lead.email}
                                    </div>
                                    {lead.lastCallAt && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Last call {format(lead.lastCallAt, 'MMM dd, HH:mm')}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <StatusBadge status={lead.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                                <div className="text-meta text-gray-500 mb-1">Service Interest</div>
                                <div className="font-medium">{lead.serviceInterest || '—'}</div>
                            </div>
                            <div>
                                <div className="text-meta text-gray-500 mb-1">Created</div>
                                <div className="font-medium">{format(lead.createdAt, 'MMM dd, yyyy')}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-section-title mb-3">Notes</h3>
                        <p className="text-body text-gray-600">{lead.notes}</p>
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
                        <h3 className="text-section-title mb-3">Audit Log</h3>
                        <div className="space-y-3">
                            {lead.auditLog.map((entry) => (
                                <div key={entry.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-body">{entry.action}</span>
                                            <span className="text-meta text-gray-500">
                                                {format(entry.timestamp, 'MMM dd, HH:mm')}
                                            </span>
                                        </div>
                                        <p className="text-body text-gray-600">{entry.details}</p>
                                        <p className="text-meta text-gray-400 mt-1">by {entry.user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
