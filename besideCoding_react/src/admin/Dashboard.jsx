import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../Constants'; 
import { FaUsers, FaClipboardList, FaTrophy, FaPaperPlane } from 'react-icons/fa';

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md flex items-center border-l-4 ${color}`}>
    <div className="mr-4 text-3xl">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // This is a hypothetical endpoint. You need to create it on your backend.
        const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/insights`, {
          withCredentials: true,
        });
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard insights:", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  const problemDifficultyData = stats?.problemCountsByDifficulty ? [
    { name: 'Easy', count: stats.problemCountsByDifficulty.Easy || 0 },
    { name: 'Medium', count: stats.problemCountsByDifficulty.Medium || 0 },
    { name: 'Hard', count: stats.problemCountsByDifficulty.Hard || 0 },
  ] : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FaUsers />} 
          title="Total Users" 
          value={stats?.totalUsers ?? 'N/A'}
          color="border-blue-500"
        />
        <StatCard 
          icon={<FaClipboardList />} 
          title="Total Problems" 
          value={stats?.totalProblems ?? 'N/A'}
          color="border-green-500"
        />
        <StatCard 
          icon={<FaTrophy />} 
          title="Total Contests" 
          value={stats?.totalContests ?? 'N/A'}
          color="border-yellow-500"
        />
        <StatCard 
          icon={<FaPaperPlane />} 
          title="Total Submissions" 
          value={stats?.totalSubmissions ?? 'N/A'}
          color="border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Problems by Difficulty</h2>
          {problemDifficultyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={problemDifficultyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No problem data available.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-semibold mb-4">Contest Overview</h2>
           {stats?.contestCounts ? (
             <ul className="space-y-4">
                <li className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-600">Upcoming Contests</span>
                    <span className="font-bold text-blue-600">{stats.contestCounts.upcoming}</span>
                </li>
                <li className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-600">Active Contests</span>
                    <span className="font-bold text-green-600">{stats.contestCounts.active}</span>
                </li>
                <li className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-600">Past Contests</span>
                    <span className="font-bold text-red-600">{stats.contestCounts.past}</span>
                </li>
             </ul>
           ) : (
             <p>No contest data available.</p>
           )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;