import React from 'react';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage({ summary, transactions, onDelete, onEdit, onOpenAddModal }) {
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Financial Overview
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Here is your current financial standing based on your logged transactions.
                    </p>
                </div>
                
                <button
                    onClick={() => onOpenAddModal()}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                    <PlusCircle size={18} />
                    <span>Quick Add</span>
                </button>
            </div>

            <SummaryCards summary={summary} />

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                        Recent Activity
                    </h2>
                    <span className="text-xs font-semibold text-slate-400">
                        Showing latest {recentTransactions.length} of {transactions.length}
                    </span>
                </div>

                <TransactionList 
                    transactions={recentTransactions} 
                    onDelete={onDelete} 
                    onEdit={onEdit} 
                />
            </div>
        </div>
    );
}