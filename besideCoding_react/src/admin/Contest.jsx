import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Constants';

function Contest() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE_URL + 'api/admin/contest/all', {
        withCredentials: true,
      });

      if (Array.isArray(res.data)) {
        setContests(res.data);
      } else {
        console.error('Expected array, got:', res.data);
        setContests([]);
      }
    } catch (err) {
      console.error('Failed to fetch contests', err);
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contest?')) return;

    try {
      await axios.delete(`${API_BASE_URL}api/admin/contest/delete/${id}`, {
        withCredentials: true,
      });
      setContests((prev) => prev.filter((contest) => contest.id !== id));
    } catch (err) {
      console.error('Failed to delete contest', err);
    }
  };

  const handleUpdate = (id) => {
    alert(`Update contest ID: ${id}`);
  };

  const handleCreateContest = () => {
    navigate('/admin/create-contest');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Contests</h2>
        <button
          onClick={handleCreateContest}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Create Contest
        </button>
      </div>

      {loading ? (
        <p>Loading contests...</p>
      ) : !Array.isArray(contests) || contests.length === 0 ? (
        <p>No contests available.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {contests.map((contest) => (
            <div
              key={contest.id}
              className="bg-white p-4 shadow rounded-lg border border-gray-200"
            >
              <h3 className="text-xl font-semibold">{contest.title}</h3>
              <p className="text-gray-600 mt-1">{contest.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(contest.startTime).toLocaleString()} —{' '}
                {new Date(contest.endTime).toLocaleString()}
              </p>
              <p
                className={`text-sm font-semibold mt-1 ${
                  contest.visible ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {contest.visible ? 'Visible' : 'Hidden'}
              </p>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleUpdate(contest.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(contest.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Contest;