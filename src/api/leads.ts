import type { Lead, LeadDetail } from '../types/lead';

const mockLeads: Lead[] = [
    {
        id: 'lead-1',
        name: 'John Smith',
        phone: '+1234567890',
        status: 'FOLLOW_UP',
        serviceInterest: 'ChatBot',
        lastCallAt: new Date(Date.now() - 120000),
        createdAt: new Date(Date.now() - 86400000),
    },
    {
        id: 'lead-2',
        name: 'Jane Doe',
        phone: '+1111111111',
        status: 'BOOKED',
        serviceInterest: 'Massage',
        lastCallAt: new Date(Date.now() - 3600000),
        createdAt: new Date(Date.now() - 172800000),
    },
    {
        id: 'lead-3',
        name: 'Bob Johnson',
        phone: '+2222222222',
        status: 'LOST',
        serviceInterest: 'Consultation',
        lastCallAt: new Date(Date.now() - 7200000),
        createdAt: new Date(Date.now() - 259200000),
    },
];

export const leadsApi = {
    getLeads: async (): Promise<Lead[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockLeads;
    },

    getLeadById: async (leadId: string): Promise<LeadDetail> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const lead = mockLeads.find(l => l.id === leadId);

        if (!lead) {
            throw new Error('Lead not found');
        }

        return {
            ...lead,
            relatedCalls: ['call-1', 'call-3'],
            notes: 'Customer interested in regular appointments. Prefers afternoon slots.',
            auditLog: [
                {
                    id: 'audit-1',
                    timestamp: new Date(Date.now() - 3600000),
                    action: 'Status Changed',
                    user: 'System',
                    details: 'Status changed from NEW to FOLLOW_UP',
                },
                {
                    id: 'audit-2',
                    timestamp: new Date(lead.createdAt),
                    action: 'Lead Created',
                    user: 'System',
                    details: 'Lead created from incoming call',
                },
            ],
        };
    },

    updateLead: async (leadId: string, data: Partial<Lead>): Promise<Lead> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const lead = mockLeads.find(l => l.id === leadId);
        if (!lead) {
            throw new Error('Lead not found');
        }

        return { ...lead, ...data };
    },
};
