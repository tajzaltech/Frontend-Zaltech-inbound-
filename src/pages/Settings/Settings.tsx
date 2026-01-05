import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { User, Mail, Save, LogOut, Key } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export function Settings() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        // Mock save delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSaving(false);
        alert('Profile updated successfully!');
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header title="Account Settings" />

            <div className="flex-1 overflow-auto p-4 lg:p-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    
                    {/* Profile Section */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#525252] to-[#9D1111] rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-red-900/20">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User Profile'}</h2>
                                <p className="text-sm text-gray-500 font-medium">Manage your personal account details</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9D1111]/10 focus:border-[#9D1111] transition-all"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium text-gray-400 cursor-not-allowed"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-gray-50 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="btn-primary flex-1 flex items-center justify-center gap-2 py-4"
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <button className="flex-1 bg-white border border-gray-100 text-gray-600 rounded-2xl px-6 py-4 font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                <Key className="w-4 h-4" />
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50/30 rounded-[2.5rem] border border-red-100 p-8">
                        <h3 className="text-sm font-bold text-red-900 mb-2">Danger Zone</h3>
                        <p className="text-xs text-red-600/70 mb-6">Once you sign out, you will need to re-authenticate to access your dashboard.</p>
                        <button
                            onClick={handleLogout}
                            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-red-200 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group"
                        >
                            <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            Sign Out of Application
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
