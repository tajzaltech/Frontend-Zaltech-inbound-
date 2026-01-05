import { useEffect, useState } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import type { Notification } from '../../store/notificationStore';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export function ToastContainer() {
    const { notifications } = useNotificationStore();
    const [activeToasts, setActiveToasts] = useState<Notification[]>([]);

    useEffect(() => {
        if (notifications.length > 0) {
            const latest = notifications[0];
            // Only show as toast if it's new (less than 5 seconds old)
            const isRecent = new Date().getTime() - new Date(latest.timestamp).getTime() < 5000;
            
            if (isRecent) {
                setActiveToasts(prev => {
                    // Prevent duplicate toasts for the same ID
                    if (prev.find(t => t.id === latest.id)) return prev;
                    return [latest, ...prev].slice(0, 3); // Max 3 toasts at once
                });

                // Auto-remove after 5 seconds
                const timer = setTimeout(() => {
                    setActiveToasts(prev => prev.filter(t => t.id !== latest.id));
                }, 5000);

                return () => clearTimeout(timer);
            }
        }
    }, [notifications]);

    const removeToast = (id: string) => {
        setActiveToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm">
            {activeToasts.map((toast) => (
                <div
                    key={toast.id}
                    className="animate-in slide-in-from-right-full fade-in duration-300 bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 flex gap-4 group relative overflow-hidden"
                >
                    {/* Progress Bar Background */}
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gray-100 w-full"></div>
                    {/* Animated Progress Bar */}
                    <div className={`absolute bottom-0 left-0 h-0.5 animate-toast-progress ${
                        toast.type === 'success' ? 'bg-green-500' :
                        toast.type === 'warning' ? 'bg-orange-500' :
                        toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        toast.type === 'success' ? 'bg-green-50 text-green-600' :
                        toast.type === 'warning' ? 'bg-orange-50 text-orange-600' :
                        toast.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                        {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                        {toast.type === 'info' && <Info className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 pt-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{toast.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{toast.message}</p>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors self-start"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
