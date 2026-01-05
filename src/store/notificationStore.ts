import { create } from 'zustand';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    timestamp: Date;
    toastOnly?: boolean;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    connection: WebSocket | null;
    addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    connect: () => void;
    disconnect: () => void;
}

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1/ws';

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    connection: null,

    addNotification: (data) =>
        set((state) => {
            const newNotification: Notification = {
                id: Math.random().toString(36).substr(2, 9),
                ...data,
                isRead: false,
                timestamp: new Date(),
            };
            return {
                notifications: [newNotification, ...state.notifications],
                unreadCount: data.toastOnly ? state.unreadCount : state.unreadCount + 1,
            };
        }),

    markAsRead: (id) =>
        set((state) => {
            const n = state.notifications.find(n => n.id === id);
            if (n?.isRead) return state;
            return {
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, isRead: true } : n
                ),
                unreadCount: state.unreadCount - 1,
            };
        }),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
        })),

    clearAll: () => set({ notifications: [], unreadCount: 0 }),

    connect: () => {
        if (get().connection) return;

        const ws = new WebSocket(`${WS_BASE_URL}/notifications`);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                get().addNotification({
                    title: data.title || 'New Alert',
                    message: data.message || 'Something happened',
                    type: data.type || 'info',
                });
            } catch (err) {
                console.error('Failed to parse notification message', err);
            }
        };

        ws.onclose = () => {
            set({ connection: null });
            // Optional: reconnect logic
            setTimeout(() => get().connect(), 5000);
        };

        set({ connection: ws });
    },

    disconnect: () => {
        const { connection } = get();
        if (connection) {
            connection.close();
            set({ connection: null });
        }
    },
}));
