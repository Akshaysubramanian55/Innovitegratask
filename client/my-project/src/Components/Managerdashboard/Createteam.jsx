import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import SidebarLayout from './Sidebar';

export default function CreateTeam() {
    const [teamName, setTeamName] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/employees`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            setEmployees(res.data);
        } catch (err) {
            console.error('Failed to fetch employees:', err);
            setErrorMessage('Unable to load employee list.');
        }
    };

    const handleSubmit = async () => {
        if (!teamName.trim()) {
            setErrorMessage('Team name is required.');
            return;
        }
        if (selectedMembers.length === 0) {
            setErrorMessage('Please select at least one team member.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const res = await axios.post(`${API_URL}/teams/create`, {
                teamName,
                members: selectedMembers,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            setSuccessMessage('🎉 Team created successfully!');
            setTeamName('');
            setSelectedMembers([]);
        } catch (err) {
            console.error('Failed to create team:', err);
            setErrorMessage('Failed to create team.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SidebarLayout>
        <div className="max-w-2xl mx-auto mt-10 px-6 py-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create a New Team</h2>

            {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>}
            {errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMessage}</div>}

            <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter Team Name"
                className="w-full px-4 py-3 mb-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto custom-scroll mb-6">
                {employees.length === 0 ? (
                    <p className="text-gray-500 text-sm">No employees available.</p>
                ) : (
                    employees.map((emp) => (
                        <label key={emp._id} className="block mb-3 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                value={emp._id}
                                checked={selectedMembers.includes(emp._id)}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    setSelectedMembers(prev =>
                                        e.target.checked
                                            ? [...prev, id]
                                            : prev.filter(m => m !== id)
                                    );
                                }}
                                className="mr-2 accent-blue-600"
                            />
                            <span className="font-medium">{emp.name}</span> <span className="text-gray-500 text-xs">({emp.email})</span>
                        </label>
                    ))
                )}
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Create Team'}
            </button>
        </div>
        </SidebarLayout>
    );
}
