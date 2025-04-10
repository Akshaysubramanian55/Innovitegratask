import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

export default function ExpenseForm() {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    project: '',
    date: '',
    notes: '',
    receipt: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, receipt: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) return alert('User not logged in');

    const { userId } = JSON.parse(atob(token.split('.')[1]));

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    data.append('userId', userId);

    try {
      await axios.post(`${API_URL}/submit-expense`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Expense submitted!');
      setFormData({
        amount: '',
        category: '',
        project: '',
        date: '',
        notes: '',
        receipt: null,
      });
      window.location.reload();
    } catch (err) {
      console.error('Expense submission failed', err);
      alert('Failed to submit expense.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200 animate-fadeIn"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4"> Submit Expense</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">Amount</label>
          <input
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            type="number"
            placeholder="Enter amount"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Travel, Food"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">Project / Client</label>
          <input
            name="project"
            value={formData.project}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">Date</label>
          <input
            name="date"
            value={formData.date}
            onChange={handleChange}
            type="date"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-600">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any notes about this expense..."
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-600">Upload Receipt</label>
        <input
          name="receipt"
          onChange={handleFileChange}
          type="file"
          accept="image/*,.pdf"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300"
      >
         Submit Expense
      </button>
    </form>
  );
}
