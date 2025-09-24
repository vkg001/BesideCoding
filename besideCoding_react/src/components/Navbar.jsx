import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { API_BASE_URL } from '../Constants';

const Navbar = () => {
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const avatarRef = useRef(null);

  const interviewItems = ['Online Assessment', 'Mock Interviews', 'Guides'];
  const storeItems = ['Redeem', 'My Orders', 'LeetCoins'];

  const bgColor = 'bg-[#282828]';
  const textColor = 'text-[#c7c7c7]';
  const accentColor = 'text-[#FFA116]';
  const premiumBgColor = 'bg-[#5A4D2B]';
  const premiumTextColor = 'text-[#FFD700]';
  const avatarBgColor = 'bg-[#DC143C]';
  const dropdownBgColor = 'bg-[#333333]';
  const dropdownBorderColor = 'border-[#444444]';
  const dropdownHoverBgColor = 'hover:bg-[#454545]';

  const toggleProfileDropdown = () => {
    setProfileOpen(prev => !prev);
  };

  const useSessionUserId = () => {
    const [userId, setUserId] = useState(null);
    useEffect(() => {
      axios.get(API_BASE_URL + "/api/session-user", { withCredentials: true })
        .then((res) => setUserId(res.data.userId))
        .catch(() => setUserId(null));
    }, []);
    return userId;
  };
  const userId = useSessionUserId();

  useEffect(() => {
    if (userId) {
      axios.get(`${API_BASE_URL}api/profile/${userId}`, { withCredentials: true })
        .then(res => setProfileData(res.data))
        .catch(err => console.error('Error fetching profile:', err));
    }
  }, [userId]);

  return (
    <nav className={`${bgColor} px-5 py-0 h-[50px] flex items-center justify-between ${textColor} font-sans text-[14px] relative`}>
      {/* Left Section */}
      <div className="flex items-center h-full">
        <Link to="/problems" className={`flex items-center text-2xl font-bold ${accentColor} mr-8 hover:opacity-90`}>
          <img
            src="src/assets/besideCoding-Logo.png"
            alt="besideCoding Logo"
            className="h-8 w-8 mr-2 rounded-md"
          />
          <span className="text-white">beside</span><span className={`${accentColor}`}>Coding</span>
        </Link>


        {/* Navigation Links */}
        <ul className="flex items-center list-none p-0 m-0 h-full">
          {['Explore', 'Problems', 'Contest', 'Discuss'].map((item) => (
            <li key={item} className="mr-5 h-full flex items-center">
              {item === 'Problems' ? (
                <Link to="/problems" className={`${textColor} hover:text-white no-underline`}>
                  {item}
                </Link>
              ) : item === 'Discuss' ? (
                <Link to="/discuss" className={`${textColor} hover:text-white no-underline`}>
                  {item}
                </Link>
              ) : item === 'Contest' ? (
                <Link to="/contest" className={`${textColor} hover:text-white no-underline`}>
                  {item}
                </Link> 
              ): (
                <a href={`#${item.toLowerCase()}`} className={`${textColor} hover:text-white no-underline`}>
                  {item}
                </a>
              )}
            </li>
          ))}

          {/* Interview Dropdown */}
          <li
            className="mr-5 relative cursor-pointer h-full flex items-center"
            onMouseEnter={() => setInterviewOpen(true)}
            onMouseLeave={() => setInterviewOpen(false)}
          >
            <div className={`flex items-center ${textColor} hover:text-white`}>
              <span>Interview</span>
              <span className="ml-1 text-xs transform scale-75">▼</span>
            </div>
            {interviewOpen && (
              <ul className={`absolute top-full left-0 mt-0 ${dropdownBgColor} border ${dropdownBorderColor} rounded-md shadow-lg py-1 min-w-[160px] z-50 list-none`}>
                {interviewItems.map(item => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`block px-4 py-2 ${textColor} ${dropdownHoverBgColor} hover:text-white no-underline text-sm`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Store Dropdown */}
          <li
            className="mr-5 relative cursor-pointer h-full flex items-center"
            onMouseEnter={() => setStoreOpen(true)}
            onMouseLeave={() => setStoreOpen(false)}
          >
            <div className={`flex items-center ${accentColor} hover:text-yellow-400`}>
              <span>Store</span>
              <span className={`ml-1 text-xs transform scale-75 ${accentColor}`}>▼</span>
            </div>
            {storeOpen && (
              <ul className={`absolute top-full left-0 mt-0 ${dropdownBgColor} border ${dropdownBorderColor} rounded-md shadow-lg py-1 min-w-[160px] z-50 list-none`}>
                {storeItems.map(item => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`block px-4 py-2 ${textColor} ${dropdownHoverBgColor} hover:text-white no-underline text-sm`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="flex items-center h-full">
        {/* Bell Icon Placeholder */}
        <span className="text-lg mr-4 cursor-pointer hover:text-white">
          🔔
        </span>

        {/* Fire Icon and Count */}
        <div className={`flex items-center mr-5 ${accentColor}`}>
          <span className="text-xl mr-1">🔥</span>
          <span className="font-medium">0</span>
        </div>

        {/* Avatar and Profile Dropdown */}
        <div className="relative">
          <button
            ref={avatarRef}
            onClick={toggleProfileDropdown}
            className={`w-[30px] h-[30px] rounded-full ${avatarBgColor} mr-3 flex items-center justify-center cursor-pointer overflow-hidden`}
            aria-haspopup="true"
            aria-expanded={profileOpen}
          >
            {profileData?.profile_pic ? (
              <img
                src={profileData.profile_pic}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <svg viewBox="0 0 24 24" fill="black" className="w-4 h-4 opacity-70">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            )}
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

export default Navbar;
