import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const ProblemNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const avatarRef = useRef(null);

  const toggleProfileDropdown = () => {
    setProfileOpen(prev => !prev);
  };

  const bgColor = 'bg-[#282828]';
  const textColor = 'text-[#c7c7c7]';
  const accentColor = 'text-[#FFA116]';
  const avatarBgColor = 'bg-[#DC143C]';
  const premiumBgColor = 'bg-[#5A4D2B]';
  const premiumTextColor = 'text-[#FFD700]';

  return (
    <nav className={`${bgColor} px-5 py-0 h-[50px] flex items-center justify-between ${textColor} font-sans text-[14px]`}>
      
      {/* 🔹 Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center font-bold text-2xl">
          <img
            src="/src/assets/besideCoding-Logo.png"
            alt="besideCoding Logo"
            className="h-8 w-8 mr-2 rounded-md"
          />
          <span className="text-white">beside</span>
          <span className={`${accentColor}`}>Coding</span>
        </div>

        {/* Problem List Link with Hover */}
        <div className="hover:bg-[#3a3a3a] px-2 py-1 rounded-md transition-colors">
          <Link to="/problems" className="flex items-center gap-1 text-sm text-[#c7c7c7] hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6M9 12h6m-6 7h6" />
            </svg>
            <span>Problem List</span>
          </Link>
        </div>
      </div>

      {/* 🔸 Center Section */}
      {/* <div className="flex justify-center flex-1">
        <button className="bg-[#3C3C3C] text-green-600 text-sm px-4 py-1 rounded hover:bg-[#4A4A4A] transition">
          Submit
        </button>
      </div> */}

      {/* 🔸 Right Section */}
      <div className="flex items-center gap-4">
        {/* Bell icon */}
        <span className="cursor-pointer hover:text-white">🔔</span>

        {/* Fire streak */}
        <div className={`flex items-center ${accentColor}`}>
          <span className="text-xl mr-1">🔥</span>
          <span>472</span>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            ref={avatarRef}
            onClick={toggleProfileDropdown}
            className={`w-[30px] h-[30px] rounded-full ${avatarBgColor} flex items-center justify-center focus:outline-none`}
          >
            <svg viewBox="0 0 24 24" fill="black" className="w-4 h-4 opacity-70">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </button>
          <ProfileDropdown
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            avatarRef={avatarRef}
          />
        </div>

        {/* Premium Button */}
        <button className={`${premiumBgColor} ${premiumTextColor} px-3 py-[5px] rounded-[4px] text-xs font-semibold cursor-pointer hover:opacity-90`}>
          Premium
        </button>
      </div>
    </nav>
  );
};

export default ProblemNavbar;
