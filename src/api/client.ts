const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
    get: async <T>(path: string): Promise<T> => {
        await delay(300); // Simulate network delay
        // Mock implementation - will be replaced by actual endpoints
        return {} as T;
    },

    post: async <T>(path: string, data?: any): Promise<T> => {
        await delay(300);
        return {} as T;
    },

    put: async <T>(path: string, data?: any): Promise<T> => {
        await delay(300);
        return {} as T;
    },

    patch: async <T>(path: string, data?: any): Promise<T> => {
        await delay(300);
        return {} as T;
    },

    delete: async <T>(path: string): Promise<T> => {
        await delay(300);
        return {} as T;
    },
};
