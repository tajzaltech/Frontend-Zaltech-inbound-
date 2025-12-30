import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { callsApi } from '../../api/calls';
import { Header } from '../../components/layout/Header';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StatsOverview } from '../../components/dashboard/StatsOverview';
import { CallVolumeChart } from '../../components/dashboard/CallVolumeChart';
import { Phone, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function CallsLive() {
    const navigate = useNavigate();

    const { data: calls = [], isLoading } = useQuery({
        queryKey: ['calls', 'live'],
        queryFn: callsApi.getLiveCalls,
        refetchInterval: 2000,
    });

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="flex-1 h-full">
                <Header title="Live Calls" />
                <div className="p-8">
                    <div className="text-center text-gray-500 py-12">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header title="Live Calls" />

            <div className="flex-1 p-4 lg:p-8 overflow-auto">
                <StatsOverview />
                <CallVolumeChart />

                {calls.length === 0 ? (
                    <div className="card text-center py-16 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Phone className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No active calls</h3>
                        <p className="text-gray-500">Waiting for incoming calls...</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {calls.map((call) => (
                            <div
                                key={call.id}
                                onClick={() => navigate(`/calls/${call.id}`)}
                                className="group card hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-gray-200 cursor-pointer transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center border border-gray-100 group-hover:from-white group-hover:to-gray-50 transition-colors">
                                            <Phone className="w-5 h-5 text-gray-600" />
                                        </div>

                                        <div>
                                            <div className="text-lg font-semibold text-gray-900 mb-1">{call.callerNumber}</div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                Started {formatDistanceToNow(call.startedAt, { addSuffix: true })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row-reverse lg:flex-row items-center justify-between lg:justify-end gap-4 lg:gap-8 ml-16 lg:ml-0">
                                        <div className="text-right">
                                            <div className="font-mono text-xl font-medium text-gray-900 mb-1">
                                                {formatDuration(call.durationSec)}
                                            </div>
                                            {call.confidence > 0 && (
                                                <div className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                    {Math.round(call.confidence * 100)}% confidence
                                                </div>
                                            )}
                                        </div>

                                        <StatusBadge status={call.status} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
