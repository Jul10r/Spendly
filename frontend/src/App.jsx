import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import {
    getTransactions,
    getSummary,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from './services/api';

import Navbar from './components/Navbar';
import TransactionForm from './components/TransactionForm';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import IncomesPage from './pages/IncomesPage';
import ExpensesPage from './pages/ExpensesPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

export default function App() {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0 });
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const loadData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [txData, summaryData] = await Promise.all([
                getTransactions(),
                getSummary()
            ]);

            if (txData?.message?.includes("token") || summaryData?.message?.includes("token")) {
                handleLogout();
                return;
            }

            setTransactions(Array.isArray(txData) ? txData : []);
            if (summaryData && typeof summaryData.totalIncome === 'number') {
                setSummary(summaryData);
            }
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadData();
        }
    }, [token]);

    const handleAuthSuccess = (newToken, newUser) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setTransactions([]);
        setSummary({ totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0 });
    };

    const handleOpenAddModal = (defaultType = 'expense') => {
        setEditingTransaction({ type: defaultType, amount: '', category: '' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleSaveTransaction = async (formData) => {
        try {
            if (editingTransaction && editingTransaction._id) {
                await updateTransaction(editingTransaction._id, formData);
            } else {
                await createTransaction(formData);
            }
            setIsModalOpen(false);
            setEditingTransaction(null);
            await loadData();
        } catch (error) {
            console.error("Error saving transaction:", error);
            alert("Failed to save transaction.");
        }
    };

    const handleDeleteTransaction = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            await deleteTransaction(id);
            await loadData();
        } catch (error) {
            console.error("Error deleting transaction:", error);
            alert("Failed to delete transaction.");
        }
    };

    const handleResetAllData = async () => {
        try {
            setLoading(true);
            for (const t of transactions) {
                await deleteTransaction(t._id);
            }
            await loadData();
            alert("All account transaction data has been permanently cleared.");
        } catch (error) {
            console.error("Error resetting data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center">
                <Routes>
                    <Route path="/login" element={<LoginPage onLoginSuccess={handleAuthSuccess} />} />
                    <Route path="/signup" element={<SignupPage onSignupSuccess={handleAuthSuccess} />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            <Navbar onOpenAddModal={() => handleOpenAddModal('expense')} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-3"></div>
                        <p className="text-xs font-bold text-slate-400">Loading your data...</p>
                    </div>
                ) : (
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <DashboardPage
                                    summary={summary}
                                    transactions={transactions}
                                    onDelete={handleDeleteTransaction}
                                    onEdit={handleOpenEditModal}
                                    onOpenAddModal={handleOpenAddModal}
                                />
                            }
                        />
                        <Route
                            path="/incomes"
                            element={
                                <IncomesPage
                                    transactions={transactions}
                                    onDelete={handleDeleteTransaction}
                                    onEdit={handleOpenEditModal}
                                    onOpenAddModal={() => handleOpenAddModal('income')}
                                />
                            }
                        />
                        <Route
                            path="/expenses"
                            element={
                                <ExpensesPage
                                    transactions={transactions}
                                    onDelete={handleDeleteTransaction}
                                    onEdit={handleOpenEditModal}
                                    onOpenAddModal={() => handleOpenAddModal('expense')}
                                />
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProfilePage
                                    summary={summary}
                                    transactions={transactions}
                                    user={user}
                                    onLogout={handleLogout}
                                    onResetAllData={handleResetAllData}
                                />
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                )}
            </main>

            <TransactionForm
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTransaction(null);
                }}
                onSave={handleSaveTransaction}
                initialData={editingTransaction}
            />
        </div>
    );
}