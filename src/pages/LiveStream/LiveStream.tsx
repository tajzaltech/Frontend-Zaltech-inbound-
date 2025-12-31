import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { callsApi } from '../../api/calls';
import { leadsApi } from '../../api/leads';

import { StatusBadge } from '../../components/ui/StatusBadge';
import { Phone, Clock, MessageSquare, User, Mail, Briefcase } from 'lucide-react';

import { clsx } from 'clsx';


export function LiveStream() {
    const navigate = useNavigate();
    const { data: calls = [] } = useQuery({
        queryKey: ['calls', 'live'],
        queryFn: callsApi.getLiveCalls,
        refetchInterval: 2000,
    });

    // Mock selecting the first active call for demo purposes
    const [selectedCallId, setSelectedCallId] = useState<string | null>(calls[0]?.id || null);
    const selectedCall = calls.find(c => c.id === selectedCallId) || calls[0];

    // Fetch lead details for the selected call
    const { data: selectedLead } = useQuery({
        queryKey: ['lead', selectedCall?.leadId],
        queryFn: () => leadsApi.getLeadById(selectedCall?.leadId || ''),
        enabled: !!selectedCall?.leadId,
    });

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            {/* Header omitted as Sidebar provides context, but keeping if needed */}
            {/* <Header title="Live Stream" /> */}

            <div className="flex-1 p-6 lg:p-8 overflow-hidden flex gap-6">

                {/* LEFT PANE: Active Calls List */}
                <div className="w-[380px] flex-shrink-0 flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
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

                                <div className="space-y-1.5 pt-3 border-t border-gray-50">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400">Intent:</span>
                                        <span className="font-medium text-blue-600">Partnership Inquiry</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400">Lead:</span>
                                        <span className="font-medium text-green-600 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            Captured
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANE: Details & Transcript */}
                <div className="flex-1 flex flex-col gap-6">

                    {/* TOP: Visualizer Status */}


                    {/* MIDDLE: Live Transcript */}
                    {/* MIDDLE: Live Transcript */}
                    <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col min-h-0 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                Live Transcript
                            </h3>
                            {selectedCall && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full animate-pulse">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    LIVE
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm shadow-blue-200">AI</div>
                                <div className="flex-1">
                                    <div className="bg-blue-50 text-blue-900 p-3 rounded-2xl rounded-tl-none inline-block text-sm">
                                        Hello! Thank you for calling Zaltech AI. How can I help you today?
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1 pl-1">10:44:53 AM</div>
                                </div>
                            </div>

                            <div className="flex gap-4 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">You</div>
                                <div className="flex-1 text-right">
                                    <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tr-none inline-block text-sm text-left">
                                        Hi, my name is {selectedLead?.name || 'Robert Wilson'}. I am interested in {selectedLead?.serviceInterest || 'strategy consulting'}.
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1 pr-1">10:45:03 AM</div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm shadow-blue-200">AI</div>
                                <div className="flex-1">
                                    <div className="bg-blue-50 text-blue-900 p-3 rounded-2xl rounded-tl-none inline-block text-sm">
                                        Great! I would be happy to help you with that. Could you share your email address?
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1 pl-1">10:45:13 AM</div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 flex justify-end">
                            <button
                                onClick={() => selectedCall && navigate(`/calls/${selectedCall.id}`)}
                                className="text-xs font-medium text-red-600 hover:text-red-700 bg-white border border-red-100 hover:border-red-200 shadow-sm px-4 py-2 rounded-lg transition-all active:scale-95"
                            >
                                View Full History
                            </button>
                        </div>
                    </div>

                    {/* BOTTOM: Lead Information */}
                    <div className="h-[140px] bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                Lead Information
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                Captured
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                                    <User className="w-3 h-3" /> Name
                                </div>
                                <div className="font-medium text-sm text-gray-900">{selectedLead?.name || 'Unknown'}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" /> Email
                                </div>
                                <div className="font-medium text-sm text-gray-900">{selectedLead?.email || 'N/A'}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                                    <Briefcase className="w-3 h-3" /> Industry
                                </div>
                                <div className="font-medium text-sm text-gray-900">{selectedLead?.serviceInterest || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
