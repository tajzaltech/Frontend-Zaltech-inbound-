export type SSEEventType =
    | 'call.started'
    | 'call.updated'
    | 'transcript.delta'
    | 'transcript.final'
    | 'extraction.updated'
    | 'handoff.required'
    | 'call.ended';

export interface SSEEvent {
    type: SSEEventType;
    callId: string;
    timestamp: Date;
    data: any;
}
