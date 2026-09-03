import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

export default function SummaryCards({ summary }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Balance</span>
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <DollarSign size={18} />
                    </div>
                </div>
                <div className={`text-3xl font-extrabold tracking-tight ${summary?.balance < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {formatCurrency(summary?.balance)}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    {summary?.transactionCount || 0} total transactions logged
                </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Income</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <ArrowUpRight size={18} />
                    </div>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-emerald-600">
                    {formatCurrency(summary?.totalIncome)}
                </div>
                <p className="text-xs text-slate-500 mt-2">Money in this period</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses</span>
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <ArrowDownRight size={18} />
                    </div>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-rose-600">
                    {formatCurrency(summary?.totalExpense)}
                </div>
                <p className="text-xs text-slate-500 mt-2">Money out this period</p>
            </div>
        </div>
    );
}