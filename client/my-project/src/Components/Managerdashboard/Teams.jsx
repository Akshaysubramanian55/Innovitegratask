import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import SidebarLayout from './Sidebar';
export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teamBudgets, setTeamBudgets] = useState({});

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await axios.get(`${API_URL}/teams`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            setTeams(res.data);


            const budgets = {};
            res.data.forEach(team => {
                budgets[team._id] = team.expenses || 0;
            });
            setTeamBudgets(budgets);
        } catch (err) {
            console.error('Error fetching teams', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBudgetChange = (teamId, value) => {
        setTeamBudgets(prev => ({
            ...prev,
            [teamId]: value,
        }));
    };

    const handleAssignBudget = async (teamId) => {
        const budget = parseFloat(teamBudgets[teamId]);
        if (isNaN(budget)) return alert("Please enter a valid budget");

        try {
            await axios.put(
                `${API_URL}/teams/${teamId}/budget`,
                { expenses: budget },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );
            alert('Budget assigned successfully');
            fetchTeams(); // Refresh
        } catch (err) {
            console.error('Error assigning budget', err);
            alert('Failed to assign budget');
        }
    };

    return (
        <SidebarLayout>
            <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Teams</h1>

                {loading ? (
                    <div className="text-gray-500">Loading teams...</div>
                ) : teams.length === 0 ? (
                    <p className="text-gray-600 text-lg">No teams found.</p>
                ) : (
                    <div className="space-y-6">
                        {teams.map((team) => (
                            <div
                                key={team._id}
                                className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
                                    <p className="text-sm text-gray-500">
                                        Created: {new Date(team.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <p className="font-medium text-gray-700 mb-1">Members:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {team.members.length > 0 ? (
                                            team.members.map((member, index) => (
                                                <li key={index}>
                                                    {typeof member === 'object' && member.name
                                                        ? `${member.name} (${member.email})`
                                                        : member}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No members</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="flex items-center gap-4 mt-4">
                                    <input
                                        type="number"
                                        value={teamBudgets[team._id] || ''}
                                        onChange={(e) =>
                                            handleBudgetChange(team._id, e.target.value)
                                        }
                                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-40"
                                        placeholder="Enter team budget"
                                    />
                                    <button
                                        onClick={() => handleAssignBudget(team._id)}
                                        className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                                    >
                                        Save Budget
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
