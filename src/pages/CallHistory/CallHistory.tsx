import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { callsApi } from '../../api/calls';
import { Header } from '../../components/layout/Header';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { format } from 'date-fns';

export function CallHistory() {
    const navigate = useNavigate();

    const { data: calls = [], isLoading } = useQuery({
        queryKey: ['calls', 'history'],
        queryFn: () => callsApi.getCallHistory(),
    });

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="flex-1 h-full">
                <Header title="Call History" />
                <div className="p-8">
                    <div className="text-center text-gray-500 py-12">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header title="Call History" />

            <div className="flex-1 p-4 lg:p-8 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="card overflow-hidden !p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Caller
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Duration
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Confidence
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {calls.map((call) => (
                                        <tr
                                            key={call.id}
                                            onClick={() => navigate(`/calls/${call.id}`)}
                                            className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                                        >
                                            <td className="py-4 px-6 text-sm text-gray-900">
                                                {format(call.startedAt, 'MMM dd, yyyy HH:mm')}
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                                {call.callerNumber}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 font-mono">
                                                {formatDuration(call.durationSec)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <StatusBadge status={call.status} />
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {Math.round(call.confidence * 100)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
