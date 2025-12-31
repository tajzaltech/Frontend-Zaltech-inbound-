import { Modal } from '../ui/Modal';
import { Calendar, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import type { CallDetail } from '../../types/call';

interface CallInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    call: CallDetail | null;
}

export function CallInfoModal({ isOpen, onClose, call }: CallInfoModalProps) {
    if (!call) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Call Details"
            maxWidth="max-w-md"
        >
            <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-5 space-y-5 border border-gray-100">

                    {/* Caller Info */}
                    <div className="flex items-start gap-4 pb-5 border-b border-gray-200">
                        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-400">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Caller Name</div>
                            <div className="font-bold text-gray-900 text-xl">
                                {call.extraction.callerName || '—'}
                            </div>
                        </div>
                    </div>

                    {/* Service Interest */}
                    <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Service Interest</div>
                        <div className="font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-block text-sm border border-blue-100">
                            {call.extraction.service || '—'}
                        </div>
                    </div>

                    {/* Date & Time Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                <Calendar className="w-3 h-3" />
                                Date
                            </div>
                            <div className="font-medium text-gray-900">
                                {call.extraction.dateISO || '—'}
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                <Clock className="w-3 h-3" />
                                Time
                            </div>
                            <div className="font-medium text-gray-900">
                                {call.extraction.timeISO || '—'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirmation Status */}
                <div>
                    <div className="flex items-center justify-center gap-2">
                        {call.extraction.confirmed ? (
                            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-xl w-full justify-center border border-green-100 shadow-sm">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-semibold">Appointment Confirmed</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-3 rounded-xl w-full justify-center border border-gray-200">
                                <XCircle className="w-5 h-5" />
                                <span className="font-medium">Not Confirmed</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        className="btn-primary w-full justify-center"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
