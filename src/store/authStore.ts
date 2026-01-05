import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';
import { apiClient } from '../api/client';

interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                const response = await apiClient.post<LoginResponse>('/auth/login', {
                    email,
                    password
                });

                const rawUser = response.user;
                const user = {
                    ...rawUser,
                    role: (rawUser.role as string) === 'OPERATOR' ? 'USER' : rawUser.role
                };

                set({
                    user: user as any,
                    token: response.access_token,
                    isAuthenticated: true,
                });
            },

            register: async (name: string, email: string, password: string) => {
                const response = await apiClient.post<LoginResponse>('/auth/register', {
                    name,
                    email,
                    password
                });

                const rawUser = response.user;
                const user = {
                    ...rawUser,
                    role: (rawUser.role as string) === 'OPERATOR' ? 'USER' : rawUser.role
                };

                set({
                    user: user as any,
                    token: response.access_token,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

