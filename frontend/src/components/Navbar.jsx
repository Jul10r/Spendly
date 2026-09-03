import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wallet, LayoutDashboard, ArrowUpRight, ArrowDownRight, User, PlusCircle } from 'lucide-react';

export default function Navbar({ onOpenAddModal }) {
    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${isActive
            ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-xs'
            : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
        }`;

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900">Spendly</span>
                    </div>
                </NavLink>

                <nav className="flex items-center gap-1.5">
                    <NavLink to="/" className={navLinkClass} end>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/incomes" className={navLinkClass}>
                        <ArrowUpRight size={18} className="text-emerald-500" />
                        <span>Incomes</span>
                    </NavLink>
                    <NavLink to="/expenses" className={navLinkClass}>
                        <ArrowDownRight size={18} className="text-rose-500" />
                        <span>Expenses</span>
                    </NavLink>
                    <NavLink to="/profile" className={navLinkClass}>
                        <User size={18} />
                        <span>Profile</span>
                    </NavLink>
                </nav>

                <button
                    onClick={onOpenAddModal}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 transition-all hover:shadow-lg active:scale-95 cursor-pointer"
                >
                    <PlusCircle size={18} />
                    <span>Add Transaction</span>
                </button>
            </div>
        </header>
    );
}