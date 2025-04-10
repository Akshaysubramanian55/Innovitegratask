import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const MyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(decoded.userId);

      axios.get(`${API_URL}/employee/teams`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setTeams(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch teams:', error);
      });
    }
  }, []);

  return (
    <div>
      {teams.length === 0 ? (
        <p className="text-gray-500">No teams available.</p>
      ) : (
        <ul className="space-y-4">
          {teams.map(team => (
            <li key={team._id} className="p-4 bg-gray-100 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700">{team.name}</h3>
              <p className="text-sm text-gray-500">Created by: {team.createdBy?.name || 'N/A'}</p>
              <p className="text-sm text-gray-500 mb-1">Other Members:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {team.members
                  .filter(member => member._id !== currentUserId)
                  .map(member => (
                    <li key={member._id}>{member.name} ({member.email})</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTeams;
