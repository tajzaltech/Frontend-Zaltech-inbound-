import { apiClient } from './client';

export const authApi = {
    forgotPassword: (email: string) =>
        apiClient.post<{ message: string }>('/auth/forgot-password', { email }),

    verifyResetCode: (email: string, code: string) =>
        apiClient.post<{ message: string }>('/auth/verify-reset-code', { email, code }),

    resetPassword: (email: string, code: string, new_password: string) =>
        apiClient.post<{ message: string }>('/auth/reset-password', { email, code, new_password }),
};
