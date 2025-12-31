import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { callsApi } from '../../api/calls';
import { leadsApi } from '../../api/leads';
import { useNotificationStore } from '../../store/notificationStore';

import { StatusBadge } from '../../components/ui/StatusBadge';
import { Phone, Clock, MessageSquare, Mail, CheckCircle, XCircle } from 'lucide-react';
import { TranscriptStream } from '../../components/TranscriptStream/TranscriptStream';
import { EmailSummaryModal } from '../../components/modals/EmailSummaryModal';


import { clsx } from 'clsx';


export function LiveStream() {
    const { addNotification } = useNotificationStore();

    // -- Data Fetching --
    const { data: calls = [] } = useQuery({
        queryKey: ['calls', 'live'],
        queryFn: callsApi.getLiveCalls,
        refetchInterval: 2000,
    });

    // Mock selecting the first active call for demo purposes or by user selection
    const [selectedCallId, setSelectedCallId] = useState<string | null>(calls[0]?.id || null);

    // Find the basic call info from the list (for highlighting and fallback)
    const selectedCallSummary = calls.find(c => c.id === selectedCallId) || calls[0];

    // Fetch FULL DETAILS for the selected call (includes transcript & extraction)
    const { data: fullCall } = useQuery({
        queryKey: ['call', selectedCallId],
        queryFn: () => callsApi.getCallById(selectedCallId!),
        enabled: !!selectedCallId,
        refetchInterval: 1000, // Refresh transcript live
    });

    // Fetch lead details for the selected call
    const { data: selectedLead } = useQuery({
        queryKey: ['lead', selectedCallSummary?.leadId],
        queryFn: () => leadsApi.getLeadById(selectedCallSummary?.leadId || ''),
        enabled: !!selectedCallSummary?.leadId,
    });


    // -- Local State for Modals & Timer --
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    // -- Effects --
    useEffect(() => {
        if (!selectedCallId && calls.length > 0) {
            setSelectedCallId(calls[0].id);
        }
    }, [calls, selectedCallId]);


    // -- Handlers --
    const handleSendEmail = (email: string) => {
        setIsEmailModalOpen(false);
        addNotification({
            title: 'Email Sent',
            message: `Call summary successfully sent to ${email || 'client'}`,
            type: 'success',
        });
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Derived State
    const isActiveCall = selectedCallSummary?.status === 'IN_PROGRESS' || selectedCallSummary?.status === 'RINGING';

    // Fallback UI if no calls
    if (!calls.length && !selectedCallSummary) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] p-6 text-gray-500">
                <div className="text-xl">No active streams found.</div>
                <p className="text-sm mt-2">Waiting for new calls...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            {/* Header removed as requested, keeping it clean */}

            <div className="flex-1 p-6 lg:p-6 overflow-hidden flex gap-6">

                {/* COLUMN 1: Active Calls List (Left) */}
                <div className="w-[320px] lg:w-[350px] flex-shrink-0 flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <h2 className="text-lg font-bold text-gray-900">Active Calls ({calls.length})</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {calls.map((call) => (
                            <div
                                key={call.id}
                                onClick={() => setSelectedCallId(call.id)}
                                className={clsx(
                                    "p-4 rounded-xl border cursor-pointer transition-all duration-200 group relative overflow-hidden",
                                    selectedCallId === call.id
                                        ? "bg-white border-red-200 shadow-md shadow-red-50"
                                        : "bg-white border-gray-100 hover:border-red-100 hover:shadow-sm"
                                )}
                            >
                                {selectedCallId === call.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>
                                )}

                                <div className="flex justify-between items-start mb-3">
                                    <StatusBadge status={call.status} />
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                        <Clock className="w-3 h-3" />
                                        {formatDuration(call.durationSec)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{call.callerNumber}</div>
                                        <div className="text-xs text-gray-500">Incoming Call</div>
                                    </div>
                                </div>

                                {/* Mini stats for list item - using call summary data */}
                                {/* We don't have callerName here unless it's in Call, which it isn't. So removing or making optional. */}
                                {/* Actually, Call doesn't have extraction. So we simply remove the extra info from the list item or use mock data if needed. */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMN 2: Transcript (Center) */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col min-h-0 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-10">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            Live Transcript
                        </h3>
                        {isActiveCall && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full animate-pulse border border-red-100">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                Recording
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-h-0 relative">
                        {fullCall ? (
                            <div className="absolute inset-0">
                                <TranscriptStream transcript={fullCall.transcript} />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading transcript...</div>
                        )}
                    </div>
                </div>

                {/* COLUMN 3: Details & Actions (Right) */}
                <div className="w-[320px] lg:w-[360px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">


                    {/* 3.2 Extracted Data Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-6">Extracted Data</h3>

                        {fullCall ? (
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-1">Caller Name</div>
                                        <div className="font-semibold text-gray-900 text-lg">
                                            {fullCall.extraction.callerName || '—'}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-1">Email</div>
                                        <div className="font-semibold text-gray-900 break-words">
                                            {selectedLead?.email || '—'}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-1">Service Interest</div>
                                        <div className="font-medium text-blue-600">
                                            {fullCall.extraction.service || '—'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 mb-1">Date</div>
                                            <div className="font-medium text-gray-900">
                                                {fullCall.extraction.dateISO || '—'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 mb-1">Time</div>
                                            <div className="font-medium text-gray-900">
                                                {fullCall.extraction.timeISO || '—'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirmation Status */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        {fullCall.extraction.confirmed ? (
                                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg w-full justify-center">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="font-medium text-sm">Confirmed</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg w-full justify-center">
                                                <XCircle className="w-4 h-4" />
                                                <span className="font-medium text-sm">Not Confirmed</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Call Actions */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setIsEmailModalOpen(true)}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            <Mail className="w-5 h-5" />
                                            <span>Email Summary</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">Loading call details...</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Action Modals */}
            <EmailSummaryModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSend={handleSendEmail}
                defaultEmail="admin@zaltech.ai"
            />
        </div>
    );
}
