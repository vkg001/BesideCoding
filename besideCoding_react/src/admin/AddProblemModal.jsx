import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../Constants';

const AddProblemModal = ({ close, onSelect }) => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await fetch(API_BASE_URL + 'api/problems');
      const data = await res.json();
      setProblems(data);
    } catch (err) {
      console.error('Failed to fetch problems', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-lg max-w-3xl w-full text-white overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Select a Problem</h2>
        <button onClick={close} className="absolute top-4 right-6 text-white text-xl">✖</button>

        <ul className="space-y-2">
          {problems.map((problem) => (
            <li
              key={problem.id}
              className="border border-gray-700 p-4 rounded hover:bg-gray-800 cursor-pointer"
              onClick={() => onSelect(problem)}
            >
              <h3 className="font-semibold">{problem.title}</h3>
              <p className="text-sm text-gray-400">{problem.description.slice(0, 100)}...</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddProblemModal;
