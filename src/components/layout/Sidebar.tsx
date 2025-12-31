import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import {
    LayoutDashboard,
    History,
    Users,
    Box,
    LogOut,
    X,
    Settings as SettingsIcon
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);
    const { isSidebarOpen, closeSidebar } = useUIStore();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/overview' },
        { icon: History, label: 'Live Stream', path: '/live-stream' },
        { icon: Users, label: 'Leads', path: '/leads' },
        { icon: Box, label: 'Services', path: '/services' },
        { icon: SettingsIcon, label: 'Settings', path: '/settings' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
            <div className="p-6 border-b border-gray-100/50 flex items-center justify-between">
                <div>
                    <img src="/assets/logo.png" alt="Zaltech.ai" className="h-8 w-auto mb-1.5" />
                    <p className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase">AI Voice Assistant</p>
                </div>

                {/* Mobile Close Button */}
                <button
                    onClick={closeSidebar}
                    className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                closeSidebar();
                            }}
                            className={clsx(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-[linear-gradient(90deg,#525252_0%,#9D1111_100%)] text-white shadow-md shadow-red-900/10'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <item.icon className={clsx('w-5 h-5 shrink-0', isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
                >
                    <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 h-full shrink-0 z-20">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-200"
                    onClick={closeSidebar}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div className={clsx(
                "fixed inset-y-0 left-0 w-72 bg-white z-40 lg:hidden transition-transform duration-300 ease-in-out shadow-2xl",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </div>
        </>
    );
}
