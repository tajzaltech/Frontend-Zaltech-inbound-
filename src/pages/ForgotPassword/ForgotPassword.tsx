import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Key, Lock, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/auth';

type Step = 'EMAIL' | 'CODE' | 'PASSWORD' | 'SUCCESS';

export function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('EMAIL');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authApi.forgotPassword(email);
            setStep('CODE');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authApi.verifyResetCode(email, code);
            setStep('PASSWORD');
        } catch (err: any) {
            setError(err.message || 'Invalid code. Please check your email.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await authApi.resetPassword(email, code, password);
            setStep('SUCCESS');
        } catch (err: any) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'EMAIL':
                return (
                    <form onSubmit={handleSendCode} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-[#9D1111] transition-all font-medium"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Send Reset Code
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                );

            case 'CODE':
                return (
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <div className="space-y-2 text-center mb-6">
                            <p className="text-sm text-gray-500">
                                We've sent a 6-digit verification code to <br />
                                <span className="font-bold text-gray-900">{email}</span>
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Verification Code</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-[#9D1111] transition-all font-bold tracking-[0.5em] text-center text-lg"
                                    placeholder="000000"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Verify Code
                                    <CheckCircle2 className="w-4 h-4" />
                                </>
                            )}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setStep('EMAIL')}
                            className="w-full text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Use different email
                        </button>
                    </form>
                );

            case 'PASSWORD':
                return (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-[#9D1111] transition-all font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-[#9D1111] transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <p className="text-[10px] text-gray-400 ml-1 italic">Min. 8 characters with letters & numbers</p>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Update Password
                                    <Key className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                );

            case 'SUCCESS':
                return (
                    <div className="text-center space-y-6 py-4">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-gray-900">Password Changed!</h2>
                            <p className="text-sm text-gray-500">Your security is our priority. You can now use your new password to sign in.</p>
                        </div>
                        <button
                            onClick={() => navigate('/signin')}
                            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
                        >
                            Sign in to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-[440px]">
                {/* Logo */}
                <div className="text-center mb-10">
                    <img src="/assets/logo.png" alt="Zaltech" className="h-10 w-auto mb-2 mx-auto" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Security Protocol</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-10 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/30 rounded-full -mr-16 -mt-16 blur-3xl" />

                    <div className="relative mb-8 text-center">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">
                            {step === 'EMAIL' ? 'Forgot Password?' : 
                             step === 'CODE' ? 'Verification' : 
                             step === 'PASSWORD' ? 'New Password' : 'Success'}
                        </h2>
                        {step === 'EMAIL' && (
                            <p className="text-sm text-gray-500 font-medium">Enter your email and we'll send you a recovery code.</p>
                        )}
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <div className="w-1 h-4 bg-red-600 rounded-full" />
                            {error}
                        </div>
                    )}

                    {renderStep()}

                    {step !== 'SUCCESS' && (
                        <div className="mt-8 text-center">
                            <Link to="/signin" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back to Sign in
                            </Link>
                        </div>
                    )}
                </div>

                <p className="text-center text-[10px] text-gray-400 mt-10 font-bold uppercase tracking-widest">
                    Zaltech Enterprise Inbound Solutions
                </p>
            </div>
        </div>
    );
}
