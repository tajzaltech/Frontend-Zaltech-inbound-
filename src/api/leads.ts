import type { Lead, LeadDetail } from '../types/lead';
import { apiClient } from './client';

// Helper to map snake_case backend Lead to camelCase frontend Lead
function mapLead(data: any): Lead {
    let status = (data.status || 'NEW').toUpperCase();

    // Priority 1: If an appointment is booked, it's definitely BOOKED
    if (data.converted_to_appointment === true || data.appointment_id) {
        status = 'BOOKED';
    }
    // Priority 2: If lead has a call attached but no appointment, it's a FOLLOW_UP
    else if (data.call_id || status.includes('PENDING') || status.includes('FOLLOW')) {
        status = 'FOLLOW_UP';
    }
    // Priority 3: Genuine New leads (no calls, no interaction)
    else {
        status = 'NEW';
    }

    return {
        id: data.lead_id || data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || 'N/A',
        status: status as any,
        serviceInterest: data.interested_services?.[0] || data.intent || 'Unknown',
        lastCallAt: data.last_call_at ? new Date(data.last_call_at) : undefined,
        createdAt: new Date(data.created_at || Date.now()),
    };
}

export const leadsApi = {
    getLeads: async (params?: { page?: number; page_size?: number; status?: string }): Promise<Lead[]> => {
        let path = '/ops/leads';
        if (params && typeof params === 'object' && !('queryKey' in params)) {
            const query = new URLSearchParams(params as any).toString();
            path += `?${query}`;
        }

        try {
            const response = await apiClient.get<{ leads: any[] }>(path);
            return (response.leads || []).map(mapLead);
        } catch (error) {
            console.error('Leads API failed:', error);
            return []; // Return empty list on failure so UI handles it
        }
    },

    getLeadById: async (leadId: string): Promise<LeadDetail> => {
        const response = await apiClient.get<any>(`/ops/leads/${leadId}`);

        // Handle both related_calls (array) and single call_id from backend
        let relatedCalls = response.related_calls || [];
        if (relatedCalls.length === 0 && response.call_id) {
            relatedCalls = [response.call_id];
        }

        const inferType = (action: string): any => {
            const a = action.toLowerCase();
            if (a.includes('call')) return 'call';
            if (a.includes('ai') || a.includes('extracted') || a.includes('identified')) return 'ai';
            if (a.includes('status')) return 'status';
            if (a.includes('appointment') || a.includes('booked')) return 'appointment';
            return 'system';
        };

        return {
            ...mapLead(response),
            relatedCalls,
            notes: response.notes || '',
            auditLog: (response.audit_log || []).map((log: any) => ({
                id: log.id,
                timestamp: new Date(log.timestamp),
                action: log.action,
                user: log.user,
                details: log.details,
                type: log.type || inferType(log.action),
            })),
        };
    },

    updateLead: async (leadId: string, data: Partial<Lead>): Promise<Lead> => {
        // Map frontend fields to backend fields
        const backendData: any = {};
        if (data.status) backendData.status = data.status.toLowerCase();
        if ((data as any).notes) backendData.notes = (data as any).notes;

        const response = await apiClient.patch<any>(`/ops/leads/${leadId}`, backendData);
        return mapLead(response);
    },

    assignLead: async (leadId: string, userId: string): Promise<void> => {
        await apiClient.post(`/ops/leads/${leadId}/assign/${userId}`);
    },
};
