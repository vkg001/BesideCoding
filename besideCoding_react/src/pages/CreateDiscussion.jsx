// src/pages/CreateDiscussion.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../Constants';

const CreateDiscussion = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Question');
  const [content, setContent] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = ['Question', 'Article', 'Contest', 'Interview'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_BASE_URL + 'api/discussions', {
        userId: 1, // Replace this with the actual logged-in user ID
        title,
        description: content,
        type: category,
      });

      // After successful submission, redirect to discussion list
      navigate('/discuss');
    } catch (err) {
      console.error('Error creating discussion:', err);
      alert('Failed to create discussion. Try again.');
    }
  };

  return (
    <div className="bg-[#1e1e1e] text-white min-h-screen p-8 font-sans">
      <h1 className="text-2xl font-semibold mb-6 text-white">Create New Discussion</h1>

      {/* Title and Category Row */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter title..."
          className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#FFA116]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Category Dropdown */}
        {/* Category Dropdown - Click Based */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-md px-4 py-2 flex items-center text-sm cursor-pointer hover:border-[#FFA116]"
          >
            {category}
            <svg className="ml-2 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.063a.75.75 0 011.14.976l-4.25 4.656a.75.75 0 01-1.14 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <ul className="absolute z-10 bg-[#2a2a2a] border border-[#3a3a3a] mt-1 rounded-md w-full shadow-md">
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer text-sm"
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Content Box */}
      <textarea
        rows="10"
        placeholder="Write your discussion here..."
        className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#FFA116] resize-none mb-6"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-[#444] hover:bg-[#555] text-white px-4 py-2 rounded-md text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#FFA116] hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold text-sm cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateDiscussion;
