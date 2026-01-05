import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { callsApi } from '../../api/calls';
import { Header } from '../../components/layout/Header';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Phone, Clock, MessageSquare, Info, ChevronLeft } from 'lucide-react';
import { TranscriptStream } from '../../components/TranscriptStream/TranscriptStream';
import { CallInfoModal } from '../../components/modals/CallInfoModal';
import { useRealtimeStore } from '../../store/realtimeStore';
import { clsx } from 'clsx';

export function LiveStream() {
    const { data: calls = [] } = useQuery({
        queryKey: ['calls', 'live'],
        queryFn: () => callsApi.getLiveCalls(),
        refetchInterval: 5000,
    });

    const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Realtime Store
    const connectToCall = useRealtimeStore(state => state.connectToCall);
    const disconnectFromCall = useRealtimeStore(state => state.disconnectFromCall);
    const liveTranscripts = useRealtimeStore(state => state.transcripts);
    const liveExtractions = useRealtimeStore(state => state.extractions);

    // Initial selected call
    useEffect(() => {
        if (!selectedCallId && calls.length > 0) {
            setSelectedCallId(calls[0].id);
        }
    }, [calls, selectedCallId]);

    // 1. WebSocket connection effect
    useEffect(() => {
        if (selectedCallId) {
            connectToCall(selectedCallId);
            return () => {
                disconnectFromCall(selectedCallId);
            };
        }
    }, [selectedCallId, connectToCall, disconnectFromCall]);

    // 2. Full Call Details (Historical)
    const { data: fullCall } = useQuery({
        queryKey: ['call', selectedCallId],
        queryFn: () => callsApi.getCallById(selectedCallId!),
        enabled: !!selectedCallId,
    });

    const selectedCallSummary = calls.find(c => c.id === selectedCallId) || calls[0];
    const status = (selectedCallSummary?.status || '').toUpperCase().replace('-', '_');
    const isActiveCall = status === 'IN_PROGRESS' || status === 'RINGING' || status === 'IN-PROGRESS';

    // 3. Polling Fallback: If WebSocket is failing (as seen in console), 
    // we poll the transcript every 2 seconds to ensure "Real Chat" feel.
    const { data: polledTranscript = [] } = useQuery({
        queryKey: ['call', selectedCallId, 'live-transcript'],
        queryFn: async () => {
            try {
                const data = await callsApi.getCallById(selectedCallId!);
                return data.transcript;
            } catch (e) {
                return [];
            }
        },
        enabled: !!selectedCallId && (isActiveCall || true), // Force for debugging if needed, but keeping it smart
        refetchInterval: 2000, // Poll every 2s while call is active
    });

    // 4. Combine all sources: Historical + Polled + WebSocket
    // Set ensures we don't show duplicate messages
    const currentTranscript = [
        ...(fullCall?.transcript || []),
        ...polledTranscript,
        ...(liveTranscripts.get(selectedCallId || '') || [])
    ].filter((item, index, self) => 
        index === self.findIndex((t) => t.text === item.text && Math.abs(new Date(t.timestamp).getTime() - new Date(item.timestamp).getTime()) < 1000)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const currentExtraction = liveExtractions.get(selectedCallId || '') || fullCall?.extraction;

    // 5. Local ticking timer for real-time duration
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const getLiveDuration = (call: any) => {
        if (call.status === 'COMPLETED' || call.status === 'DROPPED') {
            return call.durationSec;
        }
        const start = new Date(call.startedAt).getTime();
        return Math.max(0, Math.floor((now - start) / 1000));
    };

    const handleOpenDetails = (callId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCallId(callId);
        setIsDetailsModalOpen(true);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };


    if (!calls.length && !selectedCallSummary) {
        return (
            <div className="flex-1 flex flex-col h-full bg-[#FAFAFA]">
                <Header title="Active Calls" />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-500">
                    <div className="text-xl font-semibold text-gray-900 mb-2">No active streams found</div>
                    <p className="text-sm text-gray-400">Waiting for new calls to appear...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header 
                title={selectedCallId ? "Call Transcript" : "Active Calls"} 
                actions={selectedCallId ? (
                    <button
                        onClick={() => setSelectedCallId(null)}
                        className="lg:hidden flex items-center gap-1 text-sm font-semibold text-red-600 px-3 py-1.5 bg-red-50 rounded-lg border border-red-100"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                ) : undefined}
            />

            <div className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Call List - Full width on mobile, fixed width on desktop */}
                <div className={clsx(
                    "w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-4",
                    selectedCallId && "hidden lg:flex" // Hide list on mobile if viewing transcript
                )}>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                        {calls.map((call) => {
                            const extraction = liveExtractions.get(call.id);
                            const displayName = extraction?.callerName || call.callerNumber;

                            return (
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
                                            <Clock className="w-3 h-3 text-red-500 animate-pulse" />
                                            {formatDuration(getLiveDuration(call))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 group-hover:scale-110 transition-all">
                                            <Phone className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-900 truncate">
                                                {displayName}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                {extraction?.callerName ? (
                                                    <span className="text-green-600 font-medium">✨ Identified</span>
                                                ) : (
                                                    'Live Connection'
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => handleOpenDetails(call.id, e)}
                                        className="w-full flex items-center justify-center gap-2 mt-2 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-gray-200 hover:border-red-100"
                                    >
                                        <Info className="w-3.5 h-3.5" />
                                        View Details
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Transcript Area - Visible when selected on mobile, always on desktop */}
                <div className={clsx(
                    "flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col min-h-0 shadow-sm overflow-hidden",
                    !selectedCallId && "hidden lg:flex"
                )}>
                    <div className="px-4 lg:px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                <span className="truncate max-w-[150px] lg:max-w-none">
                                    {selectedCallSummary ? (liveExtractions.get(selectedCallSummary.id)?.callerName || selectedCallSummary.callerNumber) : "Live Transcript"}
                                </span>
                            </h3>
                        </div>
                        {isActiveCall && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-[10px] lg:text-xs font-semibold rounded-full animate-pulse border border-red-100">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                Recording
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-h-0 relative">
                        <div className="absolute inset-0">
                            <TranscriptStream transcript={currentTranscript} />
                        </div>
                    </div>
                </div>
            </div>

            <CallInfoModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                call={fullCall ? { ...fullCall, transcript: currentTranscript, extraction: currentExtraction || fullCall.extraction } : null}
            />
        </div>
    );
}

