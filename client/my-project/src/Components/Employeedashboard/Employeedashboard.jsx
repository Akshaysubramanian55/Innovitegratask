import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import ExpenseForm from './Expenseform';
import ExpenseList from './ExpenseList';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MyTeams from './MyTeam'; 
export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState('submit');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">👨‍💼 Dashboard</h2>
        <button onClick={toggleSidebar}>
          <FiMenu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 md:relative md:translate-x-0 md:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="md:hidden flex justify-end p-4">
          <button onClick={closeSidebar}>
            <FiX className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">👨‍💼 Dashboard</h2>

          <button
            onClick={() => {
              setActiveTab('submit');
              closeSidebar();
            }}
            className={`block w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'submit'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-blue-100'
              }`}
          >
            Submit Expense
          </button>

          <button
            onClick={() => {
              setActiveTab('view');
              closeSidebar();
            }}
            className={`block w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'view'
              ? 'bg-green-600 text-white'
              : 'text-gray-700 hover:bg-green-100'
              }`}
          >
            View My Expenses
          </button>

          <button
            onClick={() => {
              setActiveTab('teams');
              closeSidebar();
            }}
            className={`block w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'teams'
              ? 'bg-yellow-600 text-white'
              : 'text-gray-700 hover:bg-yellow-100'
              }`}
          >
            My Teams
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
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 mt-4 md:mt-0">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'submit' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 transition hover:shadow-2xl mb-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Submit New Expense</h2>
              <ExpenseForm />
            </div>
          )}

          {activeTab === 'view' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 transition hover:shadow-2xl mb-8">
              <h2 className="text-xl font-semibold mb-4 text-green-600">My Submitted Expenses</h2>
              <ExpenseList />
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 transition hover:shadow-2xl mb-8">
              <h2 className="text-xl font-semibold mb-4 text-yellow-600">My Teams</h2>
              <MyTeams />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
