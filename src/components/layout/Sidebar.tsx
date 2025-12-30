import { NavLink, useNavigate } from 'react-router-dom';
import { Phone, History, Users, Package, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
    { path: '/calls/live', label: 'Calls (Live)', icon: Phone },
    { path: '/calls/history', label: 'Call History', icon: History },
    { path: '/leads', label: 'Leads', icon: Users },
    { path: '/services', label: 'Services', icon: Package },
];

export function Sidebar() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col shadow-[4px_0_24px_rgb(0,0,0,0.02)] z-10">
            <div className="p-6 border-b border-gray-100/50">
                <img src="/assets/logo.png" alt="Zaltech.ai" className="h-9 w-auto mb-1" />
                <p className="text-[11px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-3">AI Voice Assistant</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/10'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    <span className="text-[14px] font-medium">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl w-full transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
}
