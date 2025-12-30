import { create } from 'zustand';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    timestamp: Date;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [
        {
            id: '1',
            title: 'Missed Call',
            message: 'You have a missed call from +1 (555) 123-4567',
            type: 'warning',
            isRead: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
        },
        {
            id: '2',
            title: 'Email Sent',
            message: 'Booking confirmaton sent to john.doe@example.com',
            type: 'success',
            isRead: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
            id: '3',
            title: 'Meeting Booked',
            message: 'New appointment scheduled for tomorrow at 2:00 PM',
            type: 'info',
            isRead: true,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
    ],
    unreadCount: 2,

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
                unreadCount: state.unreadCount + 1,
            };
        }),

    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: state.unreadCount - 1,
        })),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
        })),

    clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
