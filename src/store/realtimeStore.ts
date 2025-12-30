import { create } from 'zustand';
import type { Call, TranscriptItem, Extraction } from '../types/call';
import type { SSEEvent } from '../types/events';

interface RealtimeState {
    activeCalls: Map<string, Call>;
    transcripts: Map<string, TranscriptItem[]>;
    extractions: Map<string, Extraction>;

    handleEvent: (event: SSEEvent) => void;
    updateCallDuration: (callId: string) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
    activeCalls: new Map(),
    transcripts: new Map(),
    extractions: new Map(),

    handleEvent: (event: SSEEvent) => {
        const { type, callId, data } = event;

        switch (type) {
            case 'call.started':
                set((state) => {
                    const newCalls = new Map(state.activeCalls);
                    newCalls.set(callId, data as Call);
                    return { activeCalls: newCalls };
                });
                break;

            case 'call.updated':
                set((state) => {
                    const newCalls = new Map(state.activeCalls);
                    const existing = newCalls.get(callId);
                    if (existing) {
                        newCalls.set(callId, { ...existing, ...data });
                    }
                    return { activeCalls: newCalls };
                });
                break;

            case 'transcript.delta':
            case 'transcript.final':
                set((state) => {
                    const newTranscripts = new Map(state.transcripts);
                    const existing = newTranscripts.get(callId) || [];
                    newTranscripts.set(callId, [...existing, data as TranscriptItem]);
                    return { transcripts: newTranscripts };
                });
                break;

            case 'extraction.updated':
                set((state) => {
                    const newExtractions = new Map(state.extractions);
                    newExtractions.set(callId, data as Extraction);
                    return { extractions: newExtractions };
                });
                break;

            case 'call.ended':
                set((state) => {
                    const newCalls = new Map(state.activeCalls);
                    newCalls.delete(callId);
                    return { activeCalls: newCalls };
                });
                break;
        }
    },

    updateCallDuration: (callId: string) => {
        set((state) => {
            const newCalls = new Map(state.activeCalls);
            const call = newCalls.get(callId);
            if (call) {
                const duration = Math.floor((Date.now() - call.startedAt.getTime()) / 1000);
                newCalls.set(callId, { ...call, durationSec: duration });
            }
            return { activeCalls: newCalls };
        });
    },
}));

// Mock SSE connection simulator
export function initRealtimeConnection() {
    const store = useRealtimeStore.getState();

    // Simulate periodic events for demo
    const interval = setInterval(() => {
        // Update duration for active calls
        store.activeCalls.forEach((call) => {
            store.updateCallDuration(call.id);
        });
    }, 1000);

    return () => clearInterval(interval);
}
