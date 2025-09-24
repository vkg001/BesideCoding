import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../Constants';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("api/admin/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.status}</td>
              <td>
                <button className="text-red-600 hover:underline">Ban</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
