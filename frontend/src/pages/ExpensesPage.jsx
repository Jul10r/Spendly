import React from 'react';
import TransactionList from '../components/TransactionList';
import { ArrowDownRight, PlusCircle, TrendingDown, PieChart } from 'lucide-react';

export default function ExpensesPage({ transactions, onDelete, onEdit, onOpenAddModal }) {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

    const categoryTotals = expenseTransactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
    }, {});

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
                        <span className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <ArrowDownRight size={22} />
                        </span>
                        Expense Tracker
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Monitor everyday purchases, bills, subscriptions, and living costs.
                    </p>
                </div>

                <button
                    onClick={() => onOpenAddModal('expense')}
                    className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-rose-100 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                    <PlusCircle size={18} />
                    <span>Add Expense</span>
                </button>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-200">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-wider font-bold text-rose-100">
                            Total Expenses Logged
                        </span>
                        <div className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
                            {formatCurrency(totalExpense)}
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <TrendingDown size={24} />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-rose-400/40 text-xs text-rose-100 font-medium">
                    {expenseTransactions.length} expense transactions on record
                </div>
            </div>

            {Object.keys(categoryTotals).length > 0 && (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <PieChart size={18} className="text-indigo-600" />
                        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                            Spending by Category
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {Object.entries(categoryTotals).map(([cat, amt]) => {
                            const percent = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                            return (
                                <div key={cat} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <div className="text-xs font-bold text-slate-500 truncate">{cat}</div>
                                    <div className="text-base font-extrabold text-slate-900 mt-1">{formatCurrency(amt)}</div>
                                    <div className="text-[11px] font-semibold text-rose-600 mt-0.5">{percent}% of total</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mb-4">
                    All Expense Entries
                </h2>
                <TransactionList 
                    transactions={expenseTransactions} 
                    onDelete={onDelete} 
                    onEdit={onEdit} 
                />
            </div>
        </div>
    );
}