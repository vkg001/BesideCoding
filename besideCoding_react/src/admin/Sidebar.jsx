import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../Constants';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 space-y-6">
      <h2 className="text-2xl font-bold">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/problems">Problems</Link>
        <Link to="/admin/reports">Reports</Link>
        <Link to="/admin/contest">Contest</Link>
        <Link to="/profile">User Profile</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
