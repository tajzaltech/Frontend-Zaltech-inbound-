import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/service';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email: string, _password: string) => {
                // Mock authentication - accept any credentials
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockUser: User = {
                    id: '1',
                    email,
                    name: email.split('@')[0],
                    role: 'OPERATOR',
                };

                const mockToken = 'mock-jwt-token-' + Date.now();

                set({
                    user: mockUser,
                    token: mockToken,
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
