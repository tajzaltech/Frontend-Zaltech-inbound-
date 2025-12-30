import type { Call, CallDetail } from '../types/call';

// Mock data
const mockLiveCalls: Call[] = [
    {
        id: 'call-1',
        twilioSid: 'CA1234567890',
        callerNumber: '+1234567890',
        status: 'IN_PROGRESS',
        startedAt: new Date(Date.now() - 120000), // 2 minutes ago
        durationSec: 120,
        confidence: 0.85,
        leadId: 'lead-1',
    },
    {
        id: 'call-2',
        twilioSid: 'CA0987654321',
        callerNumber: '+9876543210',
        status: 'RINGING',
        startedAt: new Date(Date.now() - 5000), // 5 seconds ago
        durationSec: 5,
        confidence: 0,
    },
];

const mockHistoryCalls: Call[] = [
    {
        id: 'call-3',
        twilioSid: 'CA1111111111',
        callerNumber: '+1111111111',
        status: 'COMPLETED',
        startedAt: new Date(Date.now() - 3600000),
        endedAt: new Date(Date.now() - 3300000),
        durationSec: 300,
        confidence: 0.92,
        outcome: 'COMPLETED',
        leadId: 'lead-2',
    },
    {
        id: 'call-4',
        twilioSid: 'CA2222222222',
        callerNumber: '+2222222222',
        status: 'DROPPED',
        startedAt: new Date(Date.now() - 7200000),
        endedAt: new Date(Date.now() - 7100000),
        durationSec: 100,
        confidence: 0.45,
        outcome: 'DROPPED',
    },
];

export const callsApi = {
    getLiveCalls: async (): Promise<Call[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockLiveCalls;
    },

    getCallHistory: async (params?: { from?: string; to?: string; status?: string }): Promise<Call[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockHistoryCalls;
    },

    getCallById: async (callId: string): Promise<CallDetail> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const call = [...mockLiveCalls, ...mockHistoryCalls].find(c => c.id === callId);

        if (!call) {
            throw new Error('Call not found');
        }

        return {
            ...call,
            transcript: [
                {
                    id: 't-1',
                    callId,
                    speaker: 'AI',
                    text: 'Hello! Thank you for calling. How can I help you today?',
                    timestamp: new Date(call.startedAt.getTime() + 1000),
                    isFinal: true,
                },
                {
                    id: 't-2',
                    callId,
                    speaker: 'CALLER',
                    text: "Hi, I'd like to book an appointment for a haircut.",
                    timestamp: new Date(call.startedAt.getTime() + 5000),
                    isFinal: true,
                },
                {
                    id: 't-3',
                    callId,
                    speaker: 'AI',
                    text: "Of course! I'd be happy to help you schedule a haircut. May I have your name please?",
                    timestamp: new Date(call.startedAt.getTime() + 8000),
                    isFinal: true,
                },
                {
                    id: 't-4',
                    callId,
                    speaker: 'CALLER',
                    text: 'My name is John Smith.',
                    timestamp: new Date(call.startedAt.getTime() + 12000),
                    isFinal: true,
                },
            ],
            extraction: {
                callerName: 'John Smith',
                service: 'Haircut',
                dateISO: '2025-12-31',
                timeISO: '14:00',
                confirmed: call.status === 'COMPLETED',
            },
        };
    },
};
