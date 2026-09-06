import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { login, verifyEmail, resendCode } from '../services/api';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, KeyRound, CheckCircle2, RotateCcw } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [isVerifying, setIsVerifying] = useState(false);
    const [code, setCode] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const interval = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendCooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            const data = await login({ email, password });

            if (data.requiresVerification) {
                setIsVerifying(true);
                setSuccessMsg(data.message || 'Please verify your email before logging in.');
                setResendCooldown(60);
                sessionStorage.setItem('pendingVerificationEmail', data.email || email);
            } else if (data.token && data.user) {
                sessionStorage.removeItem('pendingVerificationEmail');
                onLoginSuccess(data.token, data.user);
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await verifyEmail({ email, code });

            if (data.token && data.user) {
                sessionStorage.removeItem('pendingVerificationEmail');
                onLoginSuccess(data.token, data.user);
            } else {
                setError(data.message || 'Verification failed. Please check your code.');
            }
        } catch (err) {
            console.error('Verification error:', err);
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
            const data = await resendCode({ email });
            setSuccessMsg(data.message || 'A fresh code has been sent!');
            setResendCooldown(60);
        } catch (err) {
            console.error('Resend error:', err);
            setError('Failed to resend code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-xl shadow-slate-200/50">
                {isVerifying ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <KeyRound size={28} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verify Your Email</h1>
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

                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-semibold">
                                <AlertCircle size={18} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                    6-Digit Verification Code
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

                            <button
                                type="submit"
                                disabled={loading || code.length < 6}
                                className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
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
                                    onClick={() => {
                                        setIsVerifying(false);
                                        setError('');
                                        setSuccessMsg('');
                                        setCode('');
                                    }}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <LogIn size={28} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                            <p className="text-sm text-slate-500 mt-1">Sign in to access your personal Spendly dashboard</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-semibold">
                                <AlertCircle size={18} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                                {!loading && <ArrowRight size={16} />}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs font-semibold text-slate-500">
                            Don't have an account yet?{' '}
                            <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold">
                                Create an account
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}