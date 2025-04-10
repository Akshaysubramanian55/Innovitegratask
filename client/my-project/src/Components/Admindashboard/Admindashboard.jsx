import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import {
    FiMenu,
    FiX,
    FiUsers,
    FiSettings,
    FiBarChart2,
} from 'react-icons/fi';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

import { BiRupee } from 'react-icons/bi';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [teams, setTeams] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [categoryBudget, setCategoryBudget] = useState('');
    const [categories, setCategories] = useState([]);
    const [companyBudget, setCompanyBudget] = useState('');
    const [currentCompanyBudget, setCurrentCompanyBudget] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'users') {
            fetchAllUsers();
        }
    }, [activeTab]);

    const fetchAllUsers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            alert('Failed to load users.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'expenses' || activeTab === 'reports') {
            fetchExpenses();
        }
    }, [activeTab]);

    const fetchExpenses = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/expenses`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            setExpenses(res.data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            alert('Failed to load expenses');
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${API_URL}/admin/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setUsers((prev) => prev.filter((user) => user._id !== userId));
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Failed to delete user');
            }
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/', { replace: true });
    };

    useEffect(() => {
        if (activeTab === 'teams') {
            fetchTeams();
        }
    }, [activeTab]);

    const fetchTeams = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/teams`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setTeams(res.data);
        } catch (error) {
            console.error('Error fetching teams:', error);
            alert('Failed to load teams');
        }
    };


    const handleCategoryBudgetSubmit = async (e) => {
        e.preventDefault();

        const newBudget = parseFloat(categoryBudget);
        const totalAllocated = categories.reduce((acc, cat) => acc + parseFloat(cat.budget), 0);
        const totalAfterAddition = totalAllocated + newBudget;

        if (totalAfterAddition > currentCompanyBudget) {
            alert(`Cannot add this category. Total budget (₹${totalAfterAddition}) exceeds company budget (₹${currentCompanyBudget})`);
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/admin/categories`, {
                name: categoryName,
                budget: newBudget
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            alert('Category added!');
            setCategoryName('');
            setCategoryBudget('');
            fetchCategories();
        } catch (err) {
            console.error('Error adding category:', err);
            alert('Failed to add category');
        }
    };


    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/categories`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    useEffect(() => {
        if (activeTab === 'categories' || activeTab === 'reports') 
            fetchCategories();
    }, [activeTab]);

    const handleCompanyBudgetSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${API_URL}/admin/comapnybudget`, {
                budget: companyBudget
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            alert('Company budget updated!');
            setCompanyBudget('');
            fetchCompanyBudget();
        } catch (err) {
            console.error('Error saving company budget:', err);
            alert('Failed to update company budget');
        }
    };

    const fetchCompanyBudget = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/getcomapnybudget`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setCurrentCompanyBudget(res.data.budget);
        } catch (err) {
            console.error('Error fetching company budget:', err);
        }
    };

    useEffect(() => {
        if (activeTab === 'categories') {
            fetchCategories();
            fetchCompanyBudget();
        }
    }, [activeTab]);



    const sidebarItems = [
        { id: 'users', label: 'Users', icon: <FiUsers className="mr-3" /> },
        { id: 'expenses', label: 'Expenses', icon: <BiRupee className="mr-3" /> },
        { id: 'categories', label: 'Categories & Budget', icon: <FiSettings className="mr-3" /> },
        { id: 'reports', label: 'Reports', icon: <FiBarChart2 className="mr-3" /> },
        { id: 'teams', label: 'Teams', icon: <FiSettings className="mr-3" /> },];

    const Overlay = () => (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
            onClick={() => setSidebarOpen(false)}
        />
    );


    const categoryTotal = categories.reduce((sum, cat) => sum + Number(cat.budget), 0);
    const remainingCompanyBudget = currentCompanyBudget - categoryTotal;

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const budgetAfterExpenses = currentCompanyBudget - totalExpenses;

    const expensesByCategory = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
        return acc;
    }, {});

    const categoryPieData = categories.map(cat => ({
        name: cat.name,
        value: Number(cat.budget),
    }));

    const expensePieData = Object.entries(expensesByCategory).map(([category, value]) => ({
        name: category,
        value,
    }));

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffbb28'];


    return (
        <div className="flex min-h-screen bg-gray-100 relative">
            <Overlay />

            <div
                className={`fixed md:static z-20 top-0 left-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-2xl text-gray-500 hover:text-gray-800 md:hidden"
                    >
                        <FiX />
                    </button>
                </div>

                <nav className="py-4">
                    <ul>
                        {sidebarItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`flex items-center w-full px-6 py-4 md:py-3 text-left transition-colors duration-200 text-lg md:text-base ${activeTab === item.id
                                        ? 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            </li>
                        ))}

                        <li className="mt-4 px-6">
                            <button
                                className="w-full flex items-center justify-start px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md hover:shadow-lg transition duration-300"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="mr-3" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="flex-1 md:ml-0 overflow-x-hidden">
                <div className="md:hidden flex items-center justify-between bg-white shadow-md p-4 sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        aria-label="Open menu"
                    >
                        <FiMenu className="text-2xl" />
                    </button>
                    <h2 className="text-xl font-bold text-blue-600">Admin Dashboard</h2>
                    <div className="w-8"></div>
                </div>

                <div className="p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {activeTab === 'users' && (
                            <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                                </div>

                                {isLoading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : users.filter(user => user.role !== 'admin').length === 0 ? (
                                    <div className="bg-gray-50 rounded-md p-8 text-center">
                                        <p className="text-lg text-gray-600">No non-admin users found in the system.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto -mx-4 md:mx-0">
                                        <div className="inline-block min-w-full align-middle">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {users
                                                        .filter((user) => user.role !== 'admin')
                                                        .map((user) => (
                                                            <tr key={user._id} className="hover:bg-gray-50">
                                                                <td className="px-4 md:px-6 py-4 text-sm whitespace-nowrap">{user.name}</td>
                                                                <td className="px-4 md:px-6 py-4 text-sm whitespace-nowrap">{user.email}</td>
                                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                                    <span
                                                                        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${user.role === 'moderator'
                                                                            ? 'bg-blue-100 text-blue-800'
                                                                            : 'bg-green-100 text-green-800'
                                                                            }`}
                                                                    >
                                                                        {user.role}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                                                                        <button className="text-red-600 hover:text-red-900 py-1" onClick={() => deleteUser(user._id)} >Delete</button>
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'expenses' && (
                            <div className="mt-4">
                                {expenses.length === 0 ? (
                                    <div className="bg-gray-50 rounded-md p-8 text-center">
                                        <p className="text-lg text-gray-600">No expenses found.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-4">
                                        {expenses.map((expense) => (
                                            <div
                                                key={expense._id}
                                                className="bg-white border border-gray-200 shadow-md p-4 rounded-xl w-full max-w-sm"
                                            >
                                                <p className="text-sm text-gray-700 mb-1">
                                                    <span className="font-semibold">Amount:</span> ₹{expense.amount}
                                                </p>
                                                <p className="text-sm text-gray-700 mb-1">
                                                    <span className="font-semibold">Category:</span> {expense.category}
                                                </p>
                                                <p className="text-sm text-gray-700 mb-1">
                                                    <span className="font-semibold">Project:</span> {expense.project}
                                                </p>
                                                <p className="text-sm text-gray-700 mb-1">
                                                    <span className="font-semibold">Date:</span> {new Date(expense.date).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-700 mb-1 flex items-center gap-2">
                                                    <span className="font-semibold">Status:</span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${expense.status === 'approved'
                                                                ? 'bg-green-100 text-green-700'
                                                                : expense.status === 'pending'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        {expense.status}
                                                    </span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'categories' && (
                            <div className="bg-white p-6 rounded-md shadow-md mt-4">
                                <h2 className="text-2xl font-bold mb-6">Set Company Budget & Categories</h2>


                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2">Set Company Budget</h3>
                                    <form onSubmit={handleCompanyBudgetSubmit} className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            value={companyBudget}
                                            onChange={(e) => setCompanyBudget(e.target.value)}
                                            className="border border-gray-300 rounded px-3 py-2 w-60"
                                            placeholder="Enter Company Budget ₹"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Save Budget
                                        </button>
                                    </form>
                                    <p className="mt-2 text-gray-600">
                                        Current Budget: <strong>₹{currentCompanyBudget}</strong>
                                    </p>
                                </div>


                                <form onSubmit={handleCategoryBudgetSubmit} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-gray-700">Category Name</label>
                                        <input
                                            type="text"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            className="border border-gray-300 rounded px-3 py-2 w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">Budget Amount (₹)</label>
                                        <input
                                            type="number"
                                            value={categoryBudget}
                                            onChange={(e) => setCategoryBudget(e.target.value)}
                                            className="border border-gray-300 rounded px-3 py-2 w-full"
                                            required
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Allocated: ₹{categories.reduce((acc, cat) => acc + parseFloat(cat.budget), 0)} / ₹{currentCompanyBudget}
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                </form>


                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold mb-2">Existing Categories</h3>
                                    {categories.length === 0 ? (
                                        <p className="text-gray-500">No categories added yet.</p>
                                    ) : (
                                        <ul className="list-disc pl-6 space-y-1">
                                            {categories.map((cat, index) => (
                                                <li key={index}>
                                                    <strong>{cat.name}</strong>: ₹{cat.budget}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}



                        {activeTab === 'reports' && (
                            <div className="mt-4 bg-white shadow-md rounded-lg p-6">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Budget Reports</h2>

                                
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">🏢 Company Budget Summary</h3>
                                    <p className="text-gray-600">Total Budget: ₹{currentCompanyBudget.toLocaleString()}</p>
                                    <p className="text-gray-600">Allocated to Categories: ₹{categoryTotal.toLocaleString()}</p>
                                    <p className="text-gray-600">Remaining Budget: ₹{remainingCompanyBudget.toLocaleString()}</p>
                                    <p className="text-gray-600">Expenses so far: ₹{totalExpenses.toLocaleString()}</p>
                                    <p className="text-gray-600">Budget After Expenses: ₹{budgetAfterExpenses.toLocaleString()}</p>
                                </div>

                              
                                <div className="mb-12 overflow-x-auto">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">📂 Category Summary</h3>
                                    <table className="min-w-full border border-gray-200 text-left text-sm">
                                        <thead className="bg-gray-100 text-gray-700">
                                            <tr>
                                                <th className="py-2 px-4 border-b">Category</th>
                                                <th className="py-2 px-4 border-b">Allocated Budget</th>
                                                <th className="py-2 px-4 border-b">Spent</th>
                                                <th className="py-2 px-4 border-b">Remaining</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map(cat => {
                                                const spent = expensesByCategory[cat.name] || 0;
                                                const remaining = Number(cat.budget) - spent;
                                                return (
                                                    <tr key={cat.name} className="hover:bg-gray-50">
                                                        <td className="py-2 px-4 border-b">{cat.name}</td>
                                                        <td className="py-2 px-4 border-b">₹{Number(cat.budget).toLocaleString()}</td>
                                                        <td className="py-2 px-4 border-b">₹{spent.toLocaleString()}</td>
                                                        <td className="py-2 px-4 border-b">₹{remaining.toLocaleString()}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                
                                {categoryPieData.length > 0 ? (
                                    <div className="mb-12">
                                        <h3 className="text-xl font-semibold text-gray-700 mb-4">🧾 Budget Allocation by Category</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={categoryPieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                >
                                                    {categoryPieData.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 mb-12">No category budget data available for chart.</p>
                                )}

                                
                                {expensePieData.length > 0 ? (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-4">💸 Expenses by Category</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={expensePieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    fill="#82ca9d"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                >
                                                    {expensePieData.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No expense data available for chart.</p>
                                )}
                            </div>
                        )}



                        {activeTab === 'teams' && (
                            <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mt-4">
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-gray-800">Teams</h1>
                                </div>

                                {teams.length === 0 ? (
                                    <div className="bg-gray-50 rounded-md p-8 text-center">
                                        <p className="text-lg text-gray-600">No teams found.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto -mx-4 md:mx-0">
                                        <div className="inline-block min-w-full align-middle">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                            Team Name
                                                        </th>
                                                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                            Created By
                                                        </th>
                                                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                            Members
                                                        </th>
                                                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                            Created At
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {teams.map((team) => (
                                                        <tr key={team._id} className="hover:bg-gray-50">
                                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                                                                {team.name}
                                                            </td>
                                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-gray-700">
                                                                {team.createdBy?.name || 'N/A'}
                                                            </td>
                                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-gray-700">
                                                                {team.members?.map((member) => member.name).join(', ') || 'No Members'}
                                                            </td>
                                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-gray-700">
                                                                {new Date(team.createdAt).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}



                    </div>
                </div>
            </div>
        </div>
    );
}
