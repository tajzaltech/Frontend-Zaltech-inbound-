import { Modal } from '../ui/Modal';
import { Calendar, Clock, User } from 'lucide-react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    initialData: {
        date: string;
        time: string;
        service: string;
        name: string;
    };
}

export function BookingModal({ isOpen, onClose, onConfirm, initialData }: BookingModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Booking"
            footer={
                <>
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={onConfirm} className="btn-primary flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Confirm Booking
                    </button>
                </>
            }
        >
            <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-900">{initialData.service} Appointment</h4>
                        <p className="text-sm text-blue-700">For {initialData.name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                defaultValue={initialData.date}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-start/20 focus:border-primary-start"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="time"
                                defaultValue={initialData.time}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-start/20 focus:border-primary-start"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-start/20 focus:border-primary-start min-h-[100px]"
                        placeholder="Add any special instructions..."
                    ></textarea>
                </div>
            </div>
        </Modal>
    );
}
