export type CallStatus = 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED' | 'TRANSFERRED';
export type CallOutcome = 'COMPLETED' | 'DROPPED' | 'TRANSFERRED';
export type Speaker = 'CALLER' | 'AI';

export interface Call {
    id: string;
    twilioSid: string;
    callerNumber: string;
    status: CallStatus;
    startedAt: Date;
    endedAt?: Date;
    durationSec: number;
    leadId?: string;
    confidence: number;
    outcome?: CallOutcome;
}

export interface TranscriptItem {
    id: string;
    callId: string;
    speaker: Speaker;
    text: string;
    timestamp: Date;
    isFinal: boolean;
}

export interface Extraction {
    callerName?: string;
    service?: string;
    dateISO?: string;
    timeISO?: string;
    confirmed: boolean;
}

export interface CallDetail extends Call {
    transcript: TranscriptItem[];
    extraction: Extraction;
}
