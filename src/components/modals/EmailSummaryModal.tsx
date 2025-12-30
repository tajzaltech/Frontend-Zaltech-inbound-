import { Modal } from '../ui/Modal';
import { Mail } from 'lucide-react';

interface EmailSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (email: string) => void;
    defaultEmail?: string;
}

export function EmailSummaryModal({ isOpen, onClose, onSend, defaultEmail = '' }: EmailSummaryModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Send Call Summary"
            footer={
                <>
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={() => onSend(defaultEmail)} className="btn-primary flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Send Email
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-500">
                    A summary of the call transcript and extracted data will be sent to this email address.
                </p>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                    <input
                        type="email"
                        defaultValue={defaultEmail}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-start/20 focus:border-primary-start transition-colors"
                        placeholder="client@example.com"
                    />
                </div>
            </div>
        </Modal>
    );
}
