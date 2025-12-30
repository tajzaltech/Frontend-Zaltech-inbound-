import type { Service } from '../types/service';

const mockServices: Service[] = [
    {
        id: 'svc-1',
        name: 'AI Consulting',
        description: 'Strategic AI implementation and roadmap planning',
        active: true,
        createdAt: new Date('2025-01-01'),
    },
    {
        id: 'svc-2',
        name: 'Voice AI',
        description: 'Human-like voice assistants for customer support',
        active: true,
        createdAt: new Date('2025-01-01'),
    },
    {
        id: 'svc-3',
        name: 'Multi-Agent System',
        description: 'Complex problem solving with autonomous agent swarms',
        active: true,
        createdAt: new Date('2025-01-01'),
    },
    {
        id: 'svc-4',
        name: 'AI Workflow Automation',
        description: 'End-to-end business process automation',
        active: true,
        createdAt: new Date('2025-01-01'),
    },
    {
        id: 'svc-5',
        name: 'RAG & Knowledge Systems',
        description: 'Custom knowledge bases with semantic search',
        active: true,
        createdAt: new Date('2025-01-01'),
    },
    {
        id: 'svc-6',
        name: 'Industry-Specific AI Solutions',
        description: 'Tailored AI tools for healthcare, finance, and more',
        active: true,
        createdAt: new Date('2025-01-01'),
    },
];

export const servicesApi = {
    getServices: async (): Promise<Service[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockServices;
    },

    createService: async (data: Omit<Service, 'id' | 'createdAt'>): Promise<Service> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const newService: Service = {
            id: 'svc-' + Date.now(),
            ...data,
            createdAt: new Date(),
        };

        mockServices.push(newService);
        return newService;
    },

    updateService: async (id: string, data: Partial<Service>): Promise<Service> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const service = mockServices.find(s => s.id === id);
        if (!service) {
            throw new Error('Service not found');
        }

        Object.assign(service, data);
        return service;
    },

    deleteService: async (id: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const index = mockServices.findIndex(s => s.id === id);
        if (index !== -1) {
            mockServices.splice(index, 1);
        }
    },
};
