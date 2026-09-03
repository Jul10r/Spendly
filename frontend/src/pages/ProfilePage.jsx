import React, { useState } from 'react';
import { Mail, Calendar, Shield, LogOut, Trash2, AlertTriangle } from 'lucide-react';

export default function ProfilePage({ summary, transactions, user, onLogout, onResetAllData }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    User Profile & Settings
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage your personal account details and preferences.
                </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-indigo-100">
                        {initials}
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <h2 className="text-xl font-extrabold text-slate-900">
                                {user?.name || 'Spendly User'}
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider">
                                Member
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                            <Mail size={14} /> {user?.email || 'No email provided'}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                            <Calendar size={13} /> Active Session
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center sm:text-left">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Transactions</span>
                        <div className="text-xl font-extrabold text-slate-900 mt-0.5">{transactions.length}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center sm:text-left">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Balance</span>
                        <div className={`text-xl font-extrabold mt-0.5 ${summary.balance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {formatCurrency(summary.balance)}
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center sm:text-left col-span-2 sm:col-span-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Security Status</span>
                        <div className="text-sm font-extrabold text-indigo-600 mt-1 flex items-center justify-center sm:justify-start gap-1">
                            <Shield size={14} /> JWT Authenticated
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-900 text-base">Session</h3>
                    <p className="text-xs text-slate-500 mt-0.5">End your current session on this device.</p>
                </div>
                <button
                    onClick={onLogout}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                >
                    <LogOut size={16} />
                    <span>Log Out</span>
                </button>
            </div>

            <div className="bg-rose-50/50 border border-rose-200/80 rounded-3xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-extrabold text-rose-900 text-base flex items-center gap-2">
                            <AlertTriangle size={18} className="text-rose-600" />
                            Danger Zone
                        </h3>
                        <p className="text-xs text-rose-700 mt-1">
                            Clear all financial records associated with this account.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition-all cursor-pointer whitespace-nowrap"
                    >
                        <Trash2 size={16} />
                        <span>Clear All Data</span>
                    </button>
                </div>

                {showDeleteConfirm && (
                    <div className="mt-5 pt-5 border-t border-rose-200 bg-white p-4 rounded-2xl border">
                        <p className="text-xs font-bold text-rose-900">
                            Are you sure you want to delete all transactions for your account?
                        </p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onResetAllData();
                                    setShowDeleteConfirm(false);
                                }}
                                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                            >
                                Yes, Clear My Data
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}