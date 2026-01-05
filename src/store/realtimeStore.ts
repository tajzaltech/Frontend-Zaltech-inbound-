import { create } from 'zustand';
import type { Call, TranscriptItem, Extraction } from '../types/call';

interface RealtimeState {
    activeCalls: Map<string, Call>;
    transcripts: Map<string, TranscriptItem[]>;
    extractions: Map<string, Extraction>;
    connections: Map<string, WebSocket>;

    handleEvent: (callId: string, event: any) => void;
    connectToCall: (callId: string) => void;
    disconnectFromCall: (callId: string) => void;
    updateCallDuration: (callId: string) => void;
}

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1/ws';

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
    activeCalls: new Map(),
    transcripts: new Map(),
    extractions: new Map(),
    connections: new Map(),

    handleEvent: (callId: string, event: any) => {
        const { type, role, content, timestamp, data } = event;

        switch (type) {
            case 'transcript':
                set((state) => {
                    const newTranscripts = new Map(state.transcripts);
                    const existing = newTranscripts.get(callId) || [];
                    const newItem: TranscriptItem = {
                        id: `t-${timestamp}`,
                        callId,
                        speaker: role === 'assistant' ? 'AI' : 'CALLER',
                        text: content,
                        timestamp: new Date(timestamp * 1000),
                        isFinal: true,
                    };
                    newTranscripts.set(callId, [...existing, newItem]);
                    return { transcripts: newTranscripts };
                });
                break;

            case 'extraction.updated':
                set((state) => {
                    const newExtractions = new Map(state.extractions);
                    newExtractions.set(callId, {
                        callerName: data.caller_name,
                        email: data.email,
                        service: data.detected_service,
                        confirmed: data.is_confirmed,
                    } as Extraction);
                    return { extractions: newExtractions };
                });
                break;

            case 'call.ended':
                get().disconnectFromCall(callId);
                set((state) => {
                    const newCalls = new Map(state.activeCalls);
                    newCalls.delete(callId);
                    return { activeCalls: newCalls };
                });
                break;
        }
    },

    connectToCall: (callId: string) => {
        const existing = get().connections.get(callId);
        if (existing) return;

        const ws = new WebSocket(`${WS_BASE_URL}/live-transcript/${callId}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            get().handleEvent(callId, data);
        };

        ws.onclose = () => {
            get().disconnectFromCall(callId);
        };

        set((state) => {
            const newConnections = new Map(state.connections);
            newConnections.set(callId, ws);
            return { connections: newConnections };
        });
    },

    disconnectFromCall: (callId: string) => {
        const ws = get().connections.get(callId);
        if (ws) {
            ws.close();
            set((state) => {
                const newConnections = new Map(state.connections);
                newConnections.delete(callId);
                return { connections: newConnections };
            });
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

export function initRealtimeConnection() {
    const store = useRealtimeStore.getState();

    const interval = setInterval(() => {
        store.activeCalls.forEach((call) => {
            store.updateCallDuration(call.id);
        });
    }, 1000);

    return () => {
        clearInterval(interval);
        store.connections.forEach(ws => ws.close());
    };
}

