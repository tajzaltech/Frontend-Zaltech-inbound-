export type LeadStatus = 'NEW' | 'FOLLOW_UP' | 'BOOKED' | 'LOST';

export interface Lead {
    id: string;
    name: string;
    phone: string;
    status: LeadStatus;
    serviceInterest?: string;
    lastCallAt?: Date;
    createdAt: Date;
}

export interface LeadDetail extends Lead {
    relatedCalls: string[]; // Call IDs
    notes: string;
    auditLog: AuditLogEntry[];
}

export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    action: string;
    user: string;
    details: string;
}
