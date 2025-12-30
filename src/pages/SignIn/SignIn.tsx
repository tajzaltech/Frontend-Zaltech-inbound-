import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            navigate('/calls/live');
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-[420px]">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex flex-col items-center">
                        <img
                            src="/assets/logo.png"
                            alt="Zaltech.ai"
                            className="h-12 w-auto mb-3"
                        />
                        <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">AI Voice Assistant</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h1>
                        <p className="text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-gray-800 text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-gray-800 text-gray-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/20 cursor-pointer"
                                />
                                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                            </label>
                            <button type="button" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#525252] to-[#9D1111] hover:shadow-lg hover:shadow-red-900/20 text-white rounded-xl py-3.5 font-medium transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? 'Signing in...' : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4 opacity-80" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-400 mt-8">
                    Protected by enterprise-grade security
                </p>
            </div>
        </div>
    );
}
