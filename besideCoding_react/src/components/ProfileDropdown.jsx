import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  FaListAlt, FaBook, FaLightbulb, FaChartPie, FaCoins, FaFlask,
  FaFileAlt, FaTerminal, FaCog, FaEye, FaSignOutAlt, FaChevronRight
} from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../Constants';

const ProfileDropdown = ({ isOpen, onClose, avatarRef }) => {
  const dropdownRef = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const useSessionUserId = () => {
    const [userId, setUserId] = useState(null);
    useEffect(() => {
      axios.get(API_BASE_URL + "api/session-user", { withCredentials: true })
        .then((res) => setUserId(res.data.userId))
        .catch(() => setUserId(null));
    }, []);
    return userId;
  };
  const userId = useSessionUserId();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, avatarRef]);

  useEffect(() => {
    if (userId) {
      axios.get(`${API_BASE_URL}api/profile/${userId}`, { withCredentials: true })
        .then((res) => {
          setProfileData(res.data);
        })
        .catch((err) => {
          console.error('Error fetching profile:', err);
        });
    }
  }, [userId]);

  if (!isOpen) return null;

  const gridItems = [
    { icon: <FaListAlt className="text-xl text-blue-400" />, label: 'My Lists' },
    { icon: <FaBook className="text-xl text-sky-400" />, label: 'Notebook' },
    { icon: <FaLightbulb className="text-xl text-yellow-400" />, label: 'Submissions' },
    { icon: <FaChartPie className="text-xl text-green-400" />, label: 'Progress' },
    { icon: <FaCoins className="text-xl text-amber-400" />, label: 'Points' },
  ];

  const listItems = [
    { icon: <FaFlask />, label: 'Try New Features', action: () => console.log('Try New Features') },
    { icon: <FaFileAlt />, label: 'Orders', action: () => console.log('Orders') },
    { icon: <FaTerminal />, label: 'My Playgrounds', action: () => console.log('My Playgrounds') },
    { icon: <FaCog />, label: 'Settings', action: () => console.log('Settings') },
    { icon: <FaEye />, label: 'Appearance', action: () => console.log('Appearance'), hasMore: true },
    { icon: <FaSignOutAlt />, label: 'Sign Out', action: () => console.log('Sign Out') },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[340px] bg-[#2D2D2D] text-neutral-300 rounded-xl shadow-2xl p-4 z-50 border border-neutral-700"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Section with Profile Info */}
      <Link to="/profile" className="flex items-center mb-5 hover:opacity-90">
        {profileData?.profile_pic ? (
          <img
            src={profileData.profile_pic}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-16 h-16 bg-[#DC143C] rounded-full flex items-center justify-center mr-4">
            <VscAccount className="text-black text-4xl opacity-70" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-white">
            {profileData?.name || 'Loading...'}
          </h3>
          <p className="text-xs text-[#FFA116]">
            Access all features with our Premium subscription!
          </p>
        </div>
      </Link>

      {/* Grid Section */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {gridItems.map((item, index) => (
          <button
            key={index}
            className={`bg-[#3A3A3A] ${index > 2 ? 'col-span-1' : ''} ${gridItems.length === 5 && index === 3 ? 'col-start-1' : ''} ${gridItems.length === 5 && index === 4 ? 'col-start-2' : ''} p-3 rounded-lg flex flex-col items-center justify-center hover:bg-neutral-600 transition-colors aspect-square`}
          >
            <div className="mb-1.5 text-2xl">{item.icon}</div>
            <span className="text-xs text-neutral-300">{item.label}</span>
          </button>
        ))}
      </div>

      {/* List Section */}
      <ul className="space-y-1">
        {listItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={item.action}
              className="w-full flex items-center px-2 py-2.5 text-sm text-neutral-300 hover:bg-neutral-700 rounded-md transition-colors"
            >
              <span className="mr-3 text-neutral-400 text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {item.hasMore && <FaChevronRight className="ml-auto text-xs text-neutral-500" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileDropdown;
