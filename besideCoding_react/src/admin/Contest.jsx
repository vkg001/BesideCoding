import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Eye, EyeOff, Edit3, Trash2, Clock, Users, Trophy, Loader2 } from 'lucide-react';

function Contest() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Mock API calls for demonstration
  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    setLoading(true);
    try {
      // Simulated API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockContests = [
        {
          id: 1,
          title: "Spring Code Challenge 2025",
          description: "A comprehensive programming contest featuring algorithms, data structures, and problem-solving challenges for all skill levels.",
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true,
          participants: 245,
          status: 'upcoming'
        },
        {
          id: 2,
          title: "Web Development Marathon",
          description: "Build amazing web applications using modern frameworks and showcase your frontend and backend skills.",
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true,
          participants: 189,
          status: 'active'
        },
        {
          id: 3,
          title: "AI/ML Innovation Contest",
          description: "Explore machine learning algorithms and artificial intelligence solutions to solve real-world problems.",
          startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          visible: false,
          participants: 156,
          status: 'ended'
        },
        {
          id: 4,
          title: "Mobile App Development Challenge",
          description: "Create innovative mobile applications for iOS and Android platforms using cutting-edge technologies.",
          startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          visible: true,
          participants: 78,
          status: 'upcoming'
        }
      ];
      setContests(mockContests);
    } catch (err) {
      console.error('Failed to fetch contests', err);
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contest? This action cannot be undone.')) return;

    setDeleteLoading(id);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContests((prev) => prev.filter((contest) => contest.id !== id));
    } catch (err) {
      console.error('Failed to delete contest', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleUpdate = (id) => {
    // Navigate to update page
    console.log(`Update contest ID: ${id}`);
  };

  const handleCreateContest = () => {
    // Navigate to create contest page
    console.log('Navigate to create contest');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Upcoming' },
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      ended: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Ended' }
    };
    
    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                Contest Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and organize programming contests</p>
            </div>
            <button
              onClick={handleCreateContest}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Create Contest
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-gray-600 text-lg">Loading contests...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Trophy className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Contests</p>
                    <p className="text-2xl font-bold text-gray-900">{contests.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100">
                    <Clock className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Contests</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contests.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Participants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contests.reduce((sum, c) => sum + (c.participants || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contests Grid */}
            {!Array.isArray(contests) || contests.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Trophy className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contests available</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first contest</p>
                <button
                  onClick={handleCreateContest}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <Plus size={20} />
                  Create Your First Contest
                </button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {contests.map((contest) => (
                  <div
                    key={contest.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden group"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {contest.title}
                          </h3>
                          {getStatusBadge(contest.status)}
                        </div>
                        <div className="flex items-center gap-1 ml-3">
                          {contest.visible ? (
                            <Eye className="text-green-500" size={18} />
                          ) : (
                            <EyeOff className="text-gray-400" size={18} />
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {contest.description}
                      </p>

                      {/* Dates */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          <span>Start: {formatDate(contest.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          <span>End: {formatDate(contest.endTime)}</span>
                        </div>
                      </div>

                      {/* Participants */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <Users size={16} className="text-gray-400" />
                        <span>{contest.participants || 0} participants</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(contest.id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium transition-colors group-hover:bg-blue-50 group-hover:text-blue-700"
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(contest.id)}
                          disabled={deleteLoading === contest.id}
                          className="inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === contest.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Contest;