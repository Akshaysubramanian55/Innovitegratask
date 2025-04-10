import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import SidebarLayout from './Sidebar';
import API_URL from '../../config/api';

export default function ManagerDashboard() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const isApprovedTab = location.search.includes('approved');

    useEffect(() => {
        isApprovedTab ? fetchApprovedExpenses() : fetchPendingExpenses();
    }, [isApprovedTab]);

    const fetchPendingExpenses = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/expenses/pending`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            setExpenses(res.data);
        } catch (err) {
            console.error('Failed to fetch pending expenses', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchApprovedExpenses = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/expenses/approved`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            setExpenses(res.data);
        } catch (err) {
            console.error('Failed to fetch approved expenses', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.post(`${API_URL}/expenses/${id}/${action}`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            isApprovedTab ? fetchApprovedExpenses() : fetchPendingExpenses();
        } catch (err) {
            console.error(`Failed to ${action} expense`, err);
        }
    };

    return (
        <SidebarLayout>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                {isApprovedTab ? 'Approved Expenses' : 'Pending Expense Approvals'}
            </h1>

            {loading ? (
                <div className="text-center text-lg text-gray-500">Loading...</div>
            ) : expenses.length === 0 ? (
                <p className="text-gray-600 text-lg">No expenses to show.</p>
            ) : (
                <div className="space-y-6">
                    {expenses.map((expense) => (
                        <div
                            key={expense._id}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {expense.userId?.name || 'Unknown'} — ₹{expense.amount}
                                </h2>
                                <span className="text-sm text-gray-500">
                                    {new Date(expense.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="space-y-1 text-gray-700 text-sm">
                                <p><strong>Category:</strong> {expense.category}</p>
                                <p><strong>Project:</strong> {expense.project || '—'}</p>
                                <p><strong>Notes:</strong> {expense.notes || '—'}</p>
                            </div>
                            {expense.receiptUrls?.length > 0 && (
                                <a
                                    href={`${API_URL}${expense.receiptUrls[0]}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 text-indigo-600 hover:underline text-sm font-medium"
                                >
                                    View Receipt
                                </a>
                            )}
                            {!isApprovedTab && (
                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={() => handleAction(expense._id, 'approve')}
                                        className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(expense._id, 'reject')}
                                        className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </SidebarLayout>
    );
}
