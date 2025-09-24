import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../Constants';

const Discuss = () => {
  const [discussions, setDiscussions] = useState([]);
  const [activeType, setActiveType] = useState(''); // '', 'Question', etc.
  const [sort, setSort] = useState(''); // '', 'mostLiked', 'newest'

  // Fetch discussions from backend
  const fetchDiscussions = async () => {
    try {
      const payload = {withCredentials: true};
      if (activeType) payload.type = activeType;
      if (sort) payload.sort = sort;

      const response = await axios.post(API_BASE_URL + 'api/discussions/filter', payload);
      console.log('Fetched Discussions:', response.data);
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  // Refetch when activeType or sort changes
  useEffect(() => {
    fetchDiscussions();
  }, [activeType, sort]);

  return (
    <div className="bg-[#1e1e1e] text-white min-h-screen px-8 py-6 font-sans">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6 text-sm font-medium ">
          {['For You', 'Question', 'Article', 'Contest', 'Interview'].map((type) => {
            const isActive = activeType === (type === 'For You' ? '' : type);
            return (
              <button
                key={type}
                onClick={() => setActiveType(type === 'For You' ? '' : type)}
                className={`pb-1 ${isActive ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white cursor-pointer'}`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Create Post Button */}
        <Link to="/create-discussion">
          <button className="bg-[#00c853] hover:bg-[#00b248] text-black font-semibold px-4 py-1 rounded-md text-sm cursor-pointer">
            + Create
          </button>
        </Link>
      </div>

      {/* Sorting Buttons */}
      <div className="flex space-x-4 text-xs mb-4 ">
        <button
          onClick={() => setSort('mostLiked')}
          className={`${sort === 'mostLiked' ? 'text-white' : 'text-gray-400 hover:text-white cursor-pointer'}`}
        >
          ↑ Most Votes
        </button>
        <button
          onClick={() => setSort('newest')}
          className={`${sort === 'newest' ? 'text-white' : 'text-gray-400 hover:text-white cursor-pointer'}`}
        >
          🕒 Newest
        </button>
      </div>

      {/* Discussions List */}
      <div className="space-y-6">
        {discussions.length === 0 ? (
          <div className="text-gray-400 text-sm">No discussions found.</div>
        ) : (
          discussions.map((d) => (
            <div key={d.discussionId} className="border border-[#2e2e2e] p-4 rounded-md">
              <div className="text-sm text-gray-400 mb-1">
                {d.username || 'Anonymous'} • {new Date(d.createdAt).toLocaleString()}
              </div>
              <div className="text-white text-base font-semibold mb-1">{d.title}</div>
              <div className="text-sm text-gray-300">{d.description}</div>
              <div className="flex items-center text-xs text-gray-500 mt-2 space-x-4">
                <span>⬆ {d.likes}</span>
                <span>👁️ {d.views}</span>
                <span>💬 0</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Discuss;
