import type { Call, CallDetail } from '../types/call';
import { apiClient } from './client';

// Helper to map snake_case backend Call to camelCase frontend Call
function mapCall(data: any): Call {
    const callerNumber = data.caller_number ||
        data.phone ||
        data.from ||
        data.From ||
        data.customer_phone ||
        data.caller_id ||
        data.contact ||
        data.phone_number ||
        data.caller ||
        'Private Number';

    if (callerNumber === 'Private Number') {
        console.warn('Caller number missing in backend response. Payload:', data);
    }

    return {
        id: data.id || data.call_id,
        twilioSid: data.twilio_sid || data.stream_sid,
        callerNumber: callerNumber,
        status: (data.status || 'IN_PROGRESS').toUpperCase(),
        startedAt: new Date(data.started_at || data.created_at || Date.now()),
        endedAt: data.ended_at ? new Date(data.ended_at) : undefined,
        durationSec: data.duration_seconds || data.duration || 0,
        leadId: data.lead_id,
        confidence: data.confidence || 0,
        outcome: data.outcome,
    };
}

export const callsApi = {
    getLiveCalls: async (): Promise<Call[]> => {
        const response = await apiClient.get<any[]>('/ops/calls/live');
        return response.map(mapCall);
    },

    getCallHistory: async (params?: { from?: string; to?: string; status?: string }): Promise<Call[]> => {
        let path = '/ops/calls';
        // Only use params if it's a plain object and doesn't look like a react-query context
        if (params && typeof params === 'object' && !('queryKey' in params)) {
            const query = new URLSearchParams(params as any).toString();
            path += `?${query}`;
        }
        const response = await apiClient.get<any[]>(path);
        return response.map(mapCall);
    },

    getCallById: async (callId: string): Promise<CallDetail> => {
        try {
            const callData = await apiClient.get<any>(`/ops/calls/${callId}`);

            // Try to get transcript from separate endpoint, fallback to embedded transcript
            let transcriptItems = [];
            try {
                const transcriptData = await apiClient.get<any>(`/ops/calls/${callId}/transcript`);
                transcriptItems = transcriptData.transcript || transcriptData.messages || [];
            } catch (e) {
                // If separate endpoint fails, try to find it in the main call data
                transcriptItems = callData.transcript || callData.messages || [];
            }

            return {
                ...mapCall(callData),
                transcript: transcriptItems.map((t: any) => ({
                    id: t.id || `t-${t.timestamp || Math.random()}`,
                    callId,
                    speaker: (t.role === 'assistant' || t.speaker === 'AI') ? 'AI' : 'CALLER',
                    text: t.content || t.text,
                    timestamp: new Date(t.timestamp ? (t.timestamp > 10000000000 ? t.timestamp : t.timestamp * 1000) : Date.now()),
                    isFinal: true,
                })),
                extraction: {
                    callerName: callData.extraction?.caller_name || callData.caller_name,
                    service: callData.extraction?.detected_service || callData.intent,
                    dateISO: callData.extraction?.appointment_date || callData.appointment_date,
                    timeISO: callData.extraction?.appointment_time || callData.appointment_time,
                    confirmed: callData.extraction?.is_confirmed || callData.is_confirmed || false,
                },
            };
        } catch (error) {
            console.error('Failed to fetch call details:', error);
            throw error;
        }
    },
};

