import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { callsApi } from '../../api/calls';
import { leadsApi } from '../../api/leads';
import { Header } from '../../components/layout/Header';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TranscriptStream } from '../../components/TranscriptStream/TranscriptStream';
import { Phone, ArrowLeft, UserPlus, CheckCircle, XCircle, Mail, Calendar, MicOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { EmailSummaryModal } from '../../components/modals/EmailSummaryModal';
import { BookingModal } from '../../components/modals/BookingModal';
import { TransferModal } from '../../components/modals/TransferModal';

export function CallDetail() {
    const { callId } = useParams<{ callId: string }>();
    const navigate = useNavigate();
    const [duration, setDuration] = useState(0);
    const { addNotification } = useNotificationStore();

    // Modal States
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const { data: call, isLoading } = useQuery({
        queryKey: ['call', callId],
        queryFn: () => callsApi.getCallById(callId!),
        enabled: !!callId,
    });

    const { data: lead } = useQuery({
        queryKey: ['lead', call?.leadId],
        queryFn: () => leadsApi.getLeadById(call?.leadId || ''),
        enabled: !!call?.leadId,
    });

    // Live duration timer
    useEffect(() => {
        if (!call) return;

        const interval = setInterval(() => {
            if (call.status === 'IN_PROGRESS' || call.status === 'RINGING') {
                const seconds = Math.floor((Date.now() - call.startedAt.getTime()) / 1000);
                setDuration(seconds);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [call]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendEmail = (email: string) => {
        setIsEmailModalOpen(false);
        addNotification({
            title: 'Email Sent',
            message: `Call summary successfully sent to ${email || 'client'}`,
            type: 'success',
        });
    };

    const handleBookingConfirm = () => {
        setIsBookingModalOpen(false);
        addNotification({
            title: 'Booking Confirmed',
            message: 'Appointment has been scheduled in the calendar',
            type: 'success',
        });
    };

    const handleTransfer = (agentId: string) => {
        setIsTransferModalOpen(false);
        addNotification({
            title: 'Call Transferred',
            message: `Transferring call to Agent ID: ${agentId}...`,
            type: 'info',
        });
        setTimeout(() => navigate('/calls/live'), 1000);
    };

    const handleEndCall = () => {
        if (confirm('Are you sure you want to end this call?')) {
            addNotification({
                title: 'Call Ended',
                message: 'Call disconnected by agent',
                type: 'warning',
            });
            setTimeout(() => navigate('/calls/history'), 1000);
        }
    };

    if (isLoading || !call) {
        return (
            <div className="flex-1">
                <Header title="Call Detail" />
                <div className="p-6">
                    <div className="text-center text-gray-500 py-12">Loading...</div>
                </div>
            </div>
        );
    }

    const isActiveCall = call.status === 'IN_PROGRESS' || call.status === 'RINGING';
    const canBook = call.extraction.confirmed;

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header
                title="Call Detail"
                actions={
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-outline flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden md:inline">Back</span>
                    </button>
                }
            />

            <div className="flex-1 overflow-auto lg:overflow-hidden p-4 lg:p-6">
                <div className="max-w-[1600px] mx-auto h-full flex flex-col lg:flex-row gap-6">
                    {/* Left Panel - Call Info */}
                    <div className="w-full lg:w-[320px] lg:shrink-0 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm h-fit lg:h-auto">
                        <div className="p-6 overflow-auto custom-scrollbar">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                                    <Phone className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-gray-900">{call.callerNumber}</div>
                                    <div className="text-sm text-gray-500">Call ID: {call.id}</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</div>
                                    <StatusBadge status={call.status} />
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Duration</div>
                                    <div className="font-mono text-3xl font-light text-gray-900">
                                        {isActiveCall ? formatDuration(duration) : formatDuration(call.durationSec)}
                                    </div>
                                </div>

                                {call.confidence > 0 && (
                                    <div>
                                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Confidence</div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full"
                                                    style={{ width: `${call.confidence * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{Math.round(call.confidence * 100)}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Center Panel - Transcript */}
                    <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm min-h-[500px] lg:min-h-0">
                        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-white relative z-10">
                            <h2 className="text-lg font-semibold text-gray-900">Live Transcript</h2>
                            {isActiveCall && (
                                <span className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium animate-pulse">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    Recording
                                </span>
                            )}
                        </div>
                        <TranscriptStream transcript={call.transcript} />
                    </div>

                    {/* Right Panel - Structured Data & Actions */}
                    <div className="w-full lg:w-[320px] lg:shrink-0 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm h-fit lg:h-auto">
                        <div className="p-6 overflow-auto custom-scrollbar flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Extracted Data</h3>

                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-1">Caller Name</div>
                                        <div className="font-semibold text-gray-900 text-lg">
                                            {call.extraction.callerName || '—'}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-1">Email</div>
                                        <div className="font-semibold text-gray-900 break-words">
                                            {lead?.email || '—'}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-1">Service Interest</div>
                                        <div className="font-medium text-blue-600">
                                            {call.extraction.service || '—'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 mb-1">Date</div>
                                            <div className="font-medium text-gray-900">
                                                {call.extraction.dateISO || '—'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 mb-1">Time</div>
                                            <div className="font-medium text-gray-900">
                                                {call.extraction.timeISO || '—'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        {call.extraction.confirmed ? (
                                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg w-full justify-center">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="font-medium text-sm">Confirmed by Caller</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg w-full justify-center">
                                                <XCircle className="w-4 h-4" />
                                                <span className="font-medium text-sm">Not Confirmed</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setIsEmailModalOpen(true)}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            <Mail className="w-5 h-5" />
                                            <span>Email Summary</span>
                                        </button>

                                        {isActiveCall && (
                                            <>
                                                <button
                                                    onClick={() => setIsTransferModalOpen(true)}
                                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
                                                >
                                                    <UserPlus className="w-5 h-5" />
                                                    <span>Transfer to Human</span>
                                                </button>

                                                <button
                                                    onClick={handleEndCall}
                                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all font-medium active:scale-95"
                                                >
                                                    <MicOff className="w-5 h-5" />
                                                    <span>End Call</span>
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => setIsBookingModalOpen(true)}
                                            disabled={!canBook}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                            title={!canBook ? 'Booking requires caller confirmation' : ''}
                                        >
                                            <Calendar className="w-5 h-5" />
                                            <span>Create Booking</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
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

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                onConfirm={handleBookingConfirm}
                initialData={{
                    date: call.extraction.dateISO || '2025-12-31',
                    time: call.extraction.timeISO || '09:00',
                    service: call.extraction.service || 'Service',
                    name: call.extraction.callerName || 'Guest'
                }}
            />

            <TransferModal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                onTransfer={handleTransfer}
            />
        </div>
    );
}
