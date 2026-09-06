import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';
import { KeyRound, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const interval = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendCooldown]);

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await forgotPassword({ email });
            if (data.message && data.message.toLowerCase().includes('server error')) {
                setError(data.message);
                return;
            }
            setSuccessMsg(data.message || 'If an account exists, a code was sent.');
            setStep(2);
            setResendCooldown(60);
        } catch (err) {
            console.error('Forgot password error:', err);
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const data = await resetPassword({ email, code, newPassword });

            if (data.message && data.message.includes('successfully')) {
                setStep(3);
            } else {
                setError(data.message || 'Failed to reset password. Please check your code.');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0 || loading) return;
        setError('');
        setLoading(true);

        try {
            const data = await forgotPassword({ email });
            setSuccessMsg(data.message || 'A new reset code has been sent to your email.');
            setResendCooldown(60);
        } catch (err) {
            console.error('Resend error:', err);
            setError('Failed to resend code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-xl shadow-slate-200/50">

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-semibold">
                        <AlertCircle size={18} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {step === 1 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <KeyRound size={28} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password?</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Enter your email and we will send you a 6-digit code to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleRequestCode} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail size={18} />
                                    </span>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>{loading ? 'Sending code...' : 'Send Reset Code'}</span>
                                {!loading && <ArrowRight size={16} />}
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <Lock size={28} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reset Password</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Enter the 6-digit code sent to <br />
                                <span className="font-bold text-slate-800">{email}</span>
                            </p>
                        </div>

                        {successMsg && (
                            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 text-sm font-semibold">
                                <CheckCircle2 size={18} className="shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                    6-Digit Reset Code
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <KeyRound size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                        placeholder="123456"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center tracking-widest text-lg font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || code.length < 6}
                                className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>{loading ? 'Updating password...' : 'Reset Password'}</span>
                                {!loading && <ArrowRight size={16} />}
                            </button>

                            <div className="flex items-center justify-between pt-3">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0 || loading}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-slate-400 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <RotateCcw size={14} />
                                    <span>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend code'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setError(''); }}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                                >
                                    Change email
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {step === 3 && (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <CheckCircle2 size={32} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Password Reset!</h1>
                        <p className="text-sm text-slate-500 mt-2 mb-6">
                            Your password has been successfully updated. You can now log in with your new password.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer"
                        >
                            Sign In to Spendly
                        </button>
                    </div>
                )}

                {step !== 3 && (
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs font-semibold text-slate-500">
                        Remember your password?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">
                            Sign in
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}