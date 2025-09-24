import React, { useState } from 'react';
import axios from 'axios';
import AddProblemModal from './AddProblemModal';
import NewProblemForm from './NewProblemForm';
import { useNavigate } from 'react-router-dom';

const CreateContest = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
  });

  const [selectedProblems, setSelectedProblems] = useState([]);
  const [showNewProblemModal, setShowNewProblemModal] = useState(false);
  const [showExistingModal, setShowExistingModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProblemSelect = (problem) => {
    if (selectedProblems.some((p) => p.id === problem.id)) {
      alert('This problem is already added.');
      return;
    }
    setSelectedProblems((prev) => [...prev, problem]);
    setShowExistingModal(false);
  };

  const handleNewProblemSubmit = async (problemData) => {
    if (!problemData) {
      setShowNewProblemModal(false);
      return;
    }

    try {
      const res = await axios.get(API_BASE_URL + 'api/problems', {
        params: { searchTerm: problemData.title }
      });

      const matched = res.data.find(p => p.title === problemData.title);

      if (matched) {
        if (selectedProblems.some(p => p.id === matched.id)) {
          alert('This problem is already added.');
          return;
        }
        setSelectedProblems((prev) => [...prev, matched]);
      } else {
        // Fallback if not found by title (new problem just created)
        if (selectedProblems.some(p => p.title === problemData.title)) {
          alert('This problem is already added.');
          return;
        }
        setSelectedProblems((prev) => [...prev, problemData]);
      }

    } catch (err) {
      console.error('Failed to fetch new problem:', err);
      setSelectedProblems((prev) => [...prev, problemData]); // fallback
    }

    setShowNewProblemModal(false);
  };

  const handleCreateContest = async () => {
    if (selectedProblems.length === 0) {
      alert('Please add at least one problem to the contest.');
      return;
    }

    const payload = {
      ...form,
      problems: selectedProblems.map((p) => ({
        id: p.id || null,
        title: p.title,
        description: p.description,
      })),
    };

    try {
      await axios.post(API_BASE_URL + 'api/admin/contest/create', payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      alert('Contest created successfully!');
      navigate('/admin/contests'); // redirect to contest list page
    } catch (err) {
      alert('Error creating contest: ' + err.message);
    }
  };

  const removeProblem = (index) => {
    const updated = [...selectedProblems];
    updated.splice(index, 1);
    setSelectedProblems(updated);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Create Contest</h1>

        {/* Title */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-gray-600 px-3 py-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-gray-600 px-3 py-2 rounded"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block mb-1">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-gray-600 px-3 py-2 rounded"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block mb-1">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-gray-600 px-3 py-2 rounded"
          />
        </div>

        {/* Problem Controls */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setShowExistingModal(true)}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            📚 Add Existing Problem
          </button>
          <button
            onClick={() => setShowNewProblemModal(true)}
            className="bg-purple-600 px-4 py-2 rounded text-white"
          >
            ➕ Add New Problem
          </button>
        </div>

        {/* Selected Problems */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Selected Problems</h2>
          {selectedProblems.length === 0 ? (
            <p className="text-gray-400">No problems added yet.</p>
          ) : (
            <ul className="space-y-2">
              {selectedProblems.map((p, index) => (
                <li key={index} className="bg-[#2a2a2a] p-3 rounded border border-gray-600 relative">
                  <strong>{p.title}</strong>
                  <p className="text-sm text-gray-400">{p.description?.slice(0, 80)}...</p>
                  <button
                    onClick={() => removeProblem(index)}
                    className="absolute right-3 top-3 text-red-400 hover:text-red-600 text-sm"
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            onClick={handleCreateContest}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-semibold"
          >
            Create Contest
          </button>
        </div>
      </div>

      {/* Modals */}
      {showExistingModal && (
        <AddProblemModal close={() => setShowExistingModal(false)} onSelect={handleProblemSelect} />
      )}
      {showNewProblemModal && (
        <NewProblemForm onSubmit={handleNewProblemSubmit} mode="contest" />
      )}
    </div>
  );
};

export default CreateContest;
