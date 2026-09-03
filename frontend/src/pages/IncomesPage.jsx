import React from 'react';
import TransactionList from '../components/TransactionList';
import { ArrowUpRight, PlusCircle, TrendingUp } from 'lucide-react';

export default function IncomesPage({ transactions, onDelete, onEdit, onOpenAddModal }) {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <ArrowUpRight size={22} />
                        </span>
                        Income Tracker
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track salaries, freelance contracts, investments, and revenue streams.
                    </p>
                </div>

                <button
                    onClick={() => onOpenAddModal('income')}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-100 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                    <PlusCircle size={18} />
                    <span>Add Income</span>
                </button>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-200">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-wider font-bold text-emerald-100">
                            Total Income Logged
                        </span>
                        <div className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
                            {formatCurrency(totalIncome)}
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <TrendingUp size={24} />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-emerald-400/40 text-xs text-emerald-100 font-medium">
                    {incomeTransactions.length} income transactions on record
                </div>
            </div>

            <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mb-4">
                    All Income Entries
                </h2>
                <TransactionList 
                    transactions={incomeTransactions} 
                    onDelete={onDelete} 
                    onEdit={onEdit} 
                />
            </div>
        </div>
    );
}