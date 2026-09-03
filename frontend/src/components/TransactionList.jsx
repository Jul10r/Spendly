import React from 'react';
import { Trash2, Edit3, ArrowUpRight, ArrowDownRight, Inbox } from 'lucide-react';

export default function TransactionList({ transactions = [], onDelete, onEdit }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
                    <Inbox size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-800">No transactions recorded yet</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    Transactions you log will appear here with instant balance calculations.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <th className="py-3.5 px-5">Type</th>
                            <th className="py-3.5 px-5">Category</th>
                            <th className="py-3.5 px-5">Description</th>
                            <th className="py-3.5 px-5">Date</th>
                            <th className="py-3.5 px-5 text-right">Amount</th>
                            <th className="py-3.5 px-5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((t) => {
                            const isIncome = t.type === 'income';
                            return (
                                <tr key={t._id} className="hover:bg-slate-50/60 transition-colors group">
                                    <td className="py-4 px-5">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                            }`}>
                                            {isIncome ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {t.type}
                                        </span>
                                    </td>

                                    <td className="py-4 px-5 font-semibold text-slate-900 text-sm">
                                        {t.category}
                                    </td>

                                    <td className="py-4 px-5 text-slate-600 text-sm">
                                        {t.description || '—'}
                                    </td>

                                    <td className="py-4 px-5 text-slate-500 text-sm whitespace-nowrap">
                                        {t.date}
                                    </td>

                                    <td className={`py-4 px-5 text-right font-extrabold text-sm whitespace-nowrap ${isIncome ? 'text-emerald-600' : 'text-rose-600'
                                        }`}>
                                        {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                                    </td>

                                    <td className="py-4 px-5 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => onEdit(t)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                                title="Edit"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(t._id)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}