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
        serviceInterest: 'AI Consulting',
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
    {
        id: 'lead-4',
        name: 'Alice Cooper',
        phone: '+15550001234',
        status: 'NEW',
        serviceInterest: 'AI Voice Agent',
        lastCallAt: undefined,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
        id: 'lead-5',
        name: 'Michael Chen',
        phone: '+15559998888',
        status: 'NEW',
        serviceInterest: 'Website Integration',
        lastCallAt: new Date(Date.now() - 1800000), // 30 mins ago
        createdAt: new Date(Date.now() - 7200000),
    },
    {
        id: 'lead-6',
        name: 'Sarah Connor',
        phone: '+12125556789',
        status: 'FOLLOW_UP',
        serviceInterest: 'Custom Development',
        lastCallAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        createdAt: new Date(Date.now() - 86400000 * 5),
    },
    {
        id: 'lead-7',
        name: 'David Miller',
        phone: '+13105554321',
        status: 'BOOKED',
        serviceInterest: 'Monthly Support',
        lastCallAt: new Date(Date.now() - 86400000), // 1 day ago
        createdAt: new Date(Date.now() - 86400000 * 3),
    },
    {
        id: 'lead-8',
        name: 'Emily White',
        phone: '+14155559876',
        status: 'FOLLOW_UP',
        serviceInterest: 'ChatBot',
        lastCallAt: new Date(Date.now() - 43200000), // 12 hours ago
        createdAt: new Date(Date.now() - 86400000 * 2),
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
