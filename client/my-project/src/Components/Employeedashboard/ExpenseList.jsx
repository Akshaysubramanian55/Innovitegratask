import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${API_URL}/myexpenses`, {
          headers: { Authorization: `Bearer ${token}` },
          params: selectedMonth ? { month: selectedMonth } : {}
        });

        const { expenses } = res.data;

        setExpenses(expenses || []);

        const total = (expenses || []).reduce((sum, item) => sum + Number(item.amount), 0);
        setMonthlyTotal(total);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpenses();
  }, [selectedMonth]);

  const months = [
    { value: '', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Expenses</h2>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      <div className="text-gray-700 mb-4 font-medium">
        Monthly Total: ₹{monthlyTotal.toFixed(2)}
      </div>

      {expenses.length === 0 ? (
        <p className="text-gray-500 italic">No expenses found.</p>
      ) : (
        <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Project</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Notes</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Receipts</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, index) => (
              <tr
                key={exp._id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
              >
                <td className="px-4 py-3">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-green-600 font-medium">₹{exp.amount}</td>
                <td className="px-4 py-3">{exp.category}</td>
                <td className="px-4 py-3">{exp.project || '—'}</td>
                <td className="px-4 py-3">{exp.notes || '—'}</td>
                <td className="px-4 py-3 space-y-1">
                  {Array.isArray(exp.receiptUrls) && exp.receiptUrls.length > 0 ? (
                    exp.receiptUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={`${API_URL}${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm block"
                      >
                        View
                      </a>
                    ))
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      exp.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : exp.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {exp.status || 'pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
