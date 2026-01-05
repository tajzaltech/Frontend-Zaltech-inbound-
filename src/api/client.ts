const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || response.statusText);
    }
    return response.json();
}

function getHeaders() {
    const auth = localStorage.getItem('auth-storage');
    const token = auth ? JSON.parse(auth).state.token : null;
    
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'X-API-Key': import.meta.env.VITE_API_KEY || ''
    };
}

export const apiClient = {
    get: async <T>(path: string): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`, {
            headers: getHeaders(),
        });
        return handleResponse<T>(response);
    },

    post: async <T>(path: string, data?: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse<T>(response);
    },

    put: async <T>(path: string, data?: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse<T>(response);
    },

    patch: async <T>(path: string, data?: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse<T>(response);
    },

    delete: async <T>(path: string): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse<T>(response);
    },
};

