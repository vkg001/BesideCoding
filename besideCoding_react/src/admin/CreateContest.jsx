import React, { useState } from 'react';
import axios from 'axios';
import AddProblemModal from './AddProblemModal';
import NewProblemForm from './NewProblemForm';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Constants';

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
  const [isCreating, setIsCreating] = useState(false);

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

    setIsCreating(true);
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
    } finally {
      setIsCreating(false);
    }
  };

  const removeProblem = (index) => {
    const updated = [...selectedProblems];
    updated.splice(index, 1);
    setSelectedProblems(updated);
  };

  const isFormValid = form.title && form.description && form.startTime && form.endTime && selectedProblems.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Create New Contest
          </h1>
          <p className="text-slate-400 text-lg">
            Set up your programming contest with problems and schedule
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Contest Details
              </h2>
              
              <div className="space-y-5">
                {/* Title */}
                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Contest Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter contest title..."
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                             placeholder-slate-400 group-hover:border-slate-500"
                  />
                </div>

                {/* Description */}
                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your contest, rules, and objectives..."
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                             placeholder-slate-400 resize-none group-hover:border-slate-500"
                  />
                </div>

                {/* Time Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                               group-hover:border-slate-500"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                               group-hover:border-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Management */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Contest Problems
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExistingModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                             px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 
                             transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Add Existing
                  </button>
                  <button
                    onClick={() => setShowNewProblemModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
                             px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 
                             transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create New
                  </button>
                </div>
              </div>

              {/* Selected Problems List */}
              {selectedProblems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-lg">No problems added yet</p>
                  <p className="text-slate-500 text-sm mt-1">Add problems to create your contest</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProblems.map((problem, index) => (
                    <div key={index} 
                         className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 
                                  hover:bg-slate-700/50 transition-all duration-200 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                            {problem.title}
                          </h4>
                          <p className="text-slate-400 text-sm line-clamp-2">
                            {problem.description?.slice(0, 120)}
                            {problem.description?.length > 120 ? '...' : ''}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded-full">
                              Problem #{index + 1}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeProblem(index)}
                          className="ml-4 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 
                                   rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-70"
                          title="Remove problem"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contest Summary */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Contest Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">Problems</span>
                  <span className="text-white font-medium">{selectedProblems.length}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">Status</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    isFormValid 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {isFormValid ? 'Ready' : 'Incomplete'}
                  </span>
                </div>

                {form.startTime && form.endTime && (
                  <div className="py-2">
                    <span className="text-slate-400 text-sm">Duration</span>
                    <div className="text-white font-medium">
                      {(() => {
                        const start = new Date(form.startTime);
                        const end = new Date(form.endTime);
                        const diffHours = Math.round((end - start) / (1000 * 60 * 60));
                        return diffHours > 0 ? `${diffHours} hours` : 'Invalid duration';
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateContest}
              disabled={!isFormValid || isCreating}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 
                         transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none
                         ${isFormValid && !isCreating
                           ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                           : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                         }`}
            >
              {isCreating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Create Contest
                </div>
              )}
            </button>

            {!isFormValid && (
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Complete all fields and add at least one problem
                </p>
              </div>
            )}
          </div>
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