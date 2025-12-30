import { Bell, Menu } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useUIStore } from '../../store/uiStore';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface HeaderProps {
    title: string;
    actions?: React.ReactNode;
}

export function Header({ title, actions }: HeaderProps) {
    const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
    const { toggleSidebar } = useUIStore();
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-8 py-4 lg:py-5 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3 lg:gap-8">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight truncate">{title}</h1>
            </div>

            <div className="flex items-center gap-6">
                {actions && <div className="flex items-center gap-3">{actions}</div>}

                <div className="h-6 w-px bg-gray-200"></div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all relative"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowNotifications(false)}
                                ></div>
                                <div className="absolute right-0 top-full mt-4 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                                        <button
                                            onClick={() => markAllAsRead()}
                                            className="text-xs text-primary-start font-medium hover:text-primary-end transition-colors"
                                        >
                                            Mark all read
                                        </button>
                                    </div>
                                    <div className="max-h-[400px] overflow-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 text-sm">
                                                No notifications
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-50">
                                                {notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-red-50/10' : ''}`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notification.type === 'warning' ? 'bg-orange-400' :
                                                                notification.type === 'success' ? 'bg-green-400' :
                                                                    notification.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                                                                }`}></div>
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900 mb-0.5">{notification.title}</h4>
                                                                <p className="text-xs text-gray-500 leading-relaxed mb-1.5">{notification.message}</p>
                                                                <p className="text-[10px] text-gray-400">
                                                                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
