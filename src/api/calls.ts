import type { Call, CallDetail } from '../types/call';

// Mock data
const mockLiveCalls: Call[] = [
    {
        id: 'call-1',
        twilioSid: 'CA1234567890',
        callerNumber: '+1 (555) 123-4567',
        status: 'IN_PROGRESS',
        startedAt: new Date(Date.now() - 120000), // 2 minutes ago
        durationSec: 120,
        confidence: 0.85,
        leadId: 'lead-1',
    },
    {
        id: 'call-2',
        twilioSid: 'CA0987654321',
        callerNumber: '+1 (555) 987-6543',
        status: 'RINGING',
        startedAt: new Date(Date.now() - 5000), // 5 seconds ago
        durationSec: 5,
        confidence: 0,
    },
    {
        id: 'call-3',
        twilioSid: 'CA1122334455',
        callerNumber: '+1 (555) 234-5678',
        status: 'IN_PROGRESS',
        startedAt: new Date(Date.now() - 300000), // 5 minutes ago
        durationSec: 300,
        confidence: 0.92,
        leadId: 'lead-2',
    },
    {
        id: 'call-4',
        twilioSid: 'CA5566778899',
        callerNumber: '+1 (555) 345-6789',
        status: 'IN_PROGRESS',
        startedAt: new Date(Date.now() - 60000), // 1 minute ago
        durationSec: 60,
        confidence: 0.75,
    },
    {
        id: 'call-5',
        twilioSid: 'CA9988776655',
        callerNumber: '+1 (555) 456-7890',
        status: 'IN_PROGRESS',
        startedAt: new Date(Date.now() - 45000), // 45 seconds ago
        durationSec: 45,
        confidence: 0.88,
    },
    {
        id: 'call-6',
        twilioSid: 'CA4433221100',
        callerNumber: '+1 (555) 567-8901',
        status: 'RINGING',
        startedAt: new Date(Date.now() - 15000), // 15 seconds ago
        durationSec: 15,
        confidence: 0,
    },
    {
        id: 'call-7',
        twilioSid: 'CA1112223334',
        callerNumber: '+1 (555) 678-9012',
        status: 'IN_PROGRESS',
        startedAt: new Date(Date.now() - 600000), // 10 minutes ago
        durationSec: 600,
        confidence: 0.95,
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

    getCallHistory: async (_params?: { from?: string; to?: string; status?: string }): Promise<Call[]> => {
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
                    text: 'Hello! Thank you for calling Zaltech AI Solutions. My name is Sarah, your AI assistant. How can I help you today?',
                    timestamp: new Date(call.startedAt.getTime() + 1000),
                    isFinal: true,
                },
                {
                    id: 't-2',
                    callId,
                    speaker: 'CALLER',
                    text: "Hi Sarah, I was looking at your website and I'm interested in your AI customer support agents.",
                    timestamp: new Date(call.startedAt.getTime() + 5000),
                    isFinal: true,
                },
                {
                    id: 't-3',
                    callId,
                    speaker: 'AI',
                    text: "That's fantastic! Our AI customer support agents are designed to handle inquiries 24/7. Could you tell me a bit more about your business and what specific challenges you're looking to solve?",
                    timestamp: new Date(call.startedAt.getTime() + 9000),
                    isFinal: true,
                },
                {
                    id: 't-4',
                    callId,
                    speaker: 'CALLER',
                    text: "Sure. We run a mid-sized e-commerce store selling home decor. We getting overwhelmed with questions about shipping status and returns, especially during weekends.",
                    timestamp: new Date(call.startedAt.getTime() + 15000),
                    isFinal: true,
                },
                {
                    id: 't-5',
                    callId,
                    speaker: 'AI',
                    text: "I completely understand. Managing high volumes of repetitive queries can be time-consuming. Our AI agent can instantly check order statuses and guide customers through your return policy without any human intervention. How many support tickets do you typically handle per week?",
                    timestamp: new Date(call.startedAt.getTime() + 22000),
                    isFinal: true,
                },
                {
                    id: 't-6',
                    callId,
                    speaker: 'CALLER',
                    text: "It varies, but usually around 500 to 600 tickets a week. During holidays it can double.",
                    timestamp: new Date(call.startedAt.getTime() + 28000),
                    isFinal: true,
                },
                {
                    id: 't-7',
                    callId,
                    speaker: 'AI',
                    text: "Got it. Handling 600 tickets manually is significant work. Our system can automate about 80% of those tier-1 inquiries immediately. Would you be interested in setting up a demo to see how it handles live interactions?",
                    timestamp: new Date(call.startedAt.getTime() + 34000),
                    isFinal: true,
                },
                {
                    id: 't-8',
                    callId,
                    speaker: 'CALLER',
                    text: "Yes, that sounds exactly like what we need. Do I need to integrate it with Shopify?",
                    timestamp: new Date(call.startedAt.getTime() + 40000),
                    isFinal: true,
                },
                {
                    id: 't-9',
                    callId,
                    speaker: 'AI',
                    text: "A great question. Yes, we have a native one-click integration with Shopify, as well as WooCommerce and Magento. It pulls real-time order data so the answers are always accurate. Would you like to schedule that demo for sometime this week?",
                    timestamp: new Date(call.startedAt.getTime() + 46000),
                    isFinal: true,
                },
                {
                    id: 't-10',
                    callId,
                    speaker: 'CALLER',
                    text: "Ideally yes. What times do you have available?",
                    timestamp: new Date(call.startedAt.getTime() + 52000),
                    isFinal: true,
                },
                {
                    id: 't-11',
                    callId,
                    speaker: 'AI',
                    text: "I can schedule you for Thursday at 2:00 PM EST or Friday at 10:00 AM EST. Do either of those work for you?",
                    timestamp: new Date(call.startedAt.getTime() + 56000),
                    isFinal: true,
                },
                {
                    id: 't-12',
                    callId,
                    speaker: 'CALLER',
                    text: "Let's go with Thursday at 2:00 PM. That works better for my team.",
                    timestamp: new Date(call.startedAt.getTime() + 62000),
                    isFinal: true,
                },
                {
                    id: 't-13',
                    callId,
                    speaker: 'AI',
                    text: "Perfect. I have you down for a product demo this Thursday at 2:00 PM. May I have your full name and the best email address to send the calendar invite to?",
                    timestamp: new Date(call.startedAt.getTime() + 66000),
                    isFinal: true,
                },
                {
                    id: 't-14',
                    callId,
                    speaker: 'CALLER',
                    text: "It's John Smith, and the email is john.smith@homedecorstart.com.",
                    timestamp: new Date(call.startedAt.getTime() + 72000),
                    isFinal: true,
                },
                {
                    id: 't-15',
                    callId,
                    speaker: 'AI',
                    text: "Thank you, John. I've sent the invite to john.smith@homedecorstart.com. Is there anything else I can answer for you regarding our pricing or features before we meet?",
                    timestamp: new Date(call.startedAt.getTime() + 78000),
                    isFinal: true,
                },
                {
                    id: 't-16',
                    callId,
                    speaker: 'CALLER',
                    text: "Just one thing - do you support multiple languages? We have some customers in Quebec.",
                    timestamp: new Date(call.startedAt.getTime() + 84000),
                    isFinal: true,
                },
                {
                    id: 't-17',
                    callId,
                    speaker: 'AI',
                    text: "Yes, we support over 50 languages, including French. The agent auto-detects the language of the query and responds in the same language instantly.",
                    timestamp: new Date(call.startedAt.getTime() + 90000),
                    isFinal: true,
                },
                {
                    id: 't-18',
                    callId,
                    speaker: 'CALLER',
                    text: "Wow, that's impressive. Okay, I look forward to the demo then. Thanks Sarah.",
                    timestamp: new Date(call.startedAt.getTime() + 95000),
                    isFinal: true,
                },
                {
                    id: 't-19',
                    callId,
                    speaker: 'AI',
                    text: "You're very welcome, John! We look forward to showing you the platform. Have a wonderful day!",
                    timestamp: new Date(call.startedAt.getTime() + 99000),
                    isFinal: true,
                },
            ],
            extraction: {
                callerName: 'John Smith',
                service: 'AI Support Agent Demo',
                dateISO: '2025-12-31',
                timeISO: '14:00',
                confirmed: call.status === 'COMPLETED',
            },
        };
    },
};
