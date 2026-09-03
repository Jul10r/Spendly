import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Gift', 'Other Income'];
const EXPENSE_CATEGORIES = ['Food & Dining', 'Groceries', 'Rent', 'Utilities', 'Transportation', 'Entertainment', 'Shopping', 'Health', 'Other Expense'];

export default function TransactionForm({ isOpen, onClose, onSave, initialData = null }) {
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            const currentType = initialData.type || 'expense';
            const defaultCat = currentType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
            setType(currentType);
            setAmount(initialData.amount || '');
            setCategory(initialData.category || defaultCat);
            setDate(initialData.date || new Date().toISOString().split('T')[0]);
            setDescription(initialData.description || '');
        } else {
            setType('expense');
            setAmount('');
            setCategory(EXPENSE_CATEGORIES[0]);
            setDate(new Date().toISOString().split('T')[0]);
            setDescription('');
        }
        setError('');
    }, [initialData, isOpen]);

    const handleTypeChange = (newType) => {
        setType(newType);
        setCategory(newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    };

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) {
            setError('Please enter a valid positive amount');
            return;
        }
        if (!category) {
            setError('Please select a category');
            return;
        }

        onSave({
            type,
            amount: Number(amount),
            category,
            date,
            description
        });
    };

    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {initialData ? 'Edit Transaction' : 'New Transaction'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => handleTypeChange('expense')}
                            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${type === 'expense'
                                ? 'bg-rose-500 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <ArrowDownRight size={16} />
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange('income')}
                            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${type === 'income'
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <ArrowUpRight size={16} />
                            Income
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Amount ($)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">$</span>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-900 text-lg outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Description (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Groceries at Trader Joe's"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="flex gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-200 hover:shadow-lg transition-all cursor-pointer"
                        >
                            {initialData ? 'Save Changes' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}