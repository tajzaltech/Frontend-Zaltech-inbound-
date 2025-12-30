import { Modal } from '../ui/Modal';
import { ArrowRight } from 'lucide-react';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTransfer: (agentId: string) => void;
}

export function TransferModal({ isOpen, onClose, onTransfer }: TransferModalProps) {
    const agents = [
        { id: '1', name: 'Sarah Wilson', department: 'Sales', status: 'Available' },
        { id: '2', name: 'Mike Chen', department: 'Support', status: 'Busy' },
        { id: '3', name: 'Emma Davis', department: 'Billing', status: 'Available' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Transfer Call"
            maxWidth="max-w-xl"
        >
            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search agents or departments..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-start/20 focus:border-primary-start transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    {agents.map((agent) => (
                        <button
                            key={agent.id}
                            onClick={() => onTransfer(agent.id)}
                            className="w-full p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 flex items-center justify-between group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-medium">
                                    {agent.name.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">{agent.name}</div>
                                    <div className="text-xs text-gray-500">{agent.department}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded-full ${agent.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {agent.status}
                                </span>
                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-start" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </Modal>
    );
}
