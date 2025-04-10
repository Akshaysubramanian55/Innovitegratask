import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

export default function SidebarLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const currentPath = location.pathname + location.search;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">


            <aside className={`fixed top-0 left-0 z-40 w-64 bg-white shadow-md p-6 h-full transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-indigo-600">Manager Panel</h2>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-black text-xl">&times;</button>
                </div>

                <nav className="space-y-4">


                    <button
                        onClick={() => {
                            navigate('/managerdashboard');
                            setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-lg font-medium transition-all duration-300 ${location.pathname === '/managerdashboard' && !location.search.includes('approved')
                                ? 'bg-red-100 text-red-700'
                                : 'bg-red-50 text-red-800 hover:bg-red-100'
                            }`}
                    >
                        Pending Expenses
                    </button>


                    <button
                        onClick={() => {
                            navigate('/managerdashboard?tab=approved');
                            setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-lg font-medium transition-all duration-300 ${location.search.includes('approved')
                                ? 'bg-green-100 text-green-700'
                                : 'bg-green-50 text-green-800 hover:bg-green-100'
                            }`}
                    >
                        Approved Expenses
                    </button>


                    <button
                        onClick={() => {
                            navigate('/createteam');
                            setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-lg font-medium transition-all duration-300 ${isActive('/createteam')
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
                            }`}
                    >
                        Create Team
                    </button>


                    <button
                        onClick={() => {
                            navigate('/teams');
                            setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-lg font-medium transition-all duration-300 ${isActive('/teams')
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                            }`}
                    >
                        Teams
                    </button>

                    <button
                        className="w-full flex items-center gap-3 px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 hover:shadow-lg transition-all duration-300"
                        onClick={() => {
                            localStorage.removeItem("accessToken");
                            navigate("/", { replace: true });
                        }}
                    >
                        <FaSignOutAlt className="text-lg" />
                        Logout
                    </button>

                </nav>
            </aside>


            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black opacity-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}


            <div className="flex-1 p-6 md:p-10 w-full">
                <button
                    className="md:hidden mb-6 text-gray-600 text-2xl"
                    onClick={() => setSidebarOpen(true)}
                >
                    &#9776;
                </button>
                {children}
            </div>
        </div>
    );
}
