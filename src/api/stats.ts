import { apiClient } from './client';

export interface DashboardStats {
    totalCallsToday: number;
    activeAgents: number;
    avgDurationSec: number;
    sentimentScore: number;
    callsTrend: string;
    agentsStatus: string;
    durationTrend: string;
    sentimentTrend: string;
}

export const statsApi = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            const response = await apiClient.get<any>('/ops/stats');
            console.log('Stats Backend Response:', response);

            return {
                totalCallsToday: response.total_calls_today ?? response.total_calls ?? 0,
                activeAgents: response.active_agents ?? 0,
                avgDurationSec: response.avg_duration_seconds ??
                    response.avg_duration ??
                    response.avg_duration_sec ??
                    response.average_duration ??
                    0,
                callsTrend: response.calls_trend ?? '+0%',
                agentsStatus: response.agents_status ?? 'Ready',
                durationTrend: response.duration_trend ?? '+0%',
                sentimentTrend: response.sentiment_trend ?? '+0',
                sentimentScore: response.sentiment_score ?? 0,
            };
        } catch (error) {
            console.warn('Stats API not found or failed, using placeholder data:', error);
            // Fallback to placeholders so UI doesn't crash if endpoint is missing
            return {
                totalCallsToday: 0,
                activeAgents: 0,
                avgDurationSec: 0,
                sentimentScore: 0,
                callsTrend: 'Developing...',
                agentsStatus: 'Offline',
                durationTrend: '0%',
                sentimentTrend: '0',
            };
        }
    }
};
