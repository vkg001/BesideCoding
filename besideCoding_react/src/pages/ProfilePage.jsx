import React, { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Make sure useNavigate is imported
import { API_BASE_URL } from '../Constants';

// TIME AGO HELPER FUNCTION
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds < 30) return "just now";
  if (seconds < intervals.minute) return `${seconds} seconds ago`;
  if (seconds < intervals.hour) {
    const minutes = Math.floor(seconds / intervals.minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (seconds < intervals.day) {
    const hours = Math.floor(seconds / intervals.hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (seconds < intervals.week) {
    const days = Math.floor(seconds / intervals.day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (seconds < intervals.month) {
    const weeks = Math.floor(seconds / intervals.week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (seconds < intervals.month) {
    const months = Math.floor(seconds / intervals.month);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(seconds / intervals.year);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

// Custom hook to get the session user ID
const useSessionUserId = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API_BASE_URL + "/api/session-user", { withCredentials: true })
      .then((res) => setUserId(res.data.userId))
      .catch(() => setUserId(null))
      .finally(() => setLoading(false));
  }, []);

  return { userId, loading };
};

// DifficultyBar helper component
const DifficultyBar = ({ level, solved, total, textColor, bgColor }) => {
  const percentage = total > 0 ? (solved / total) * 100 : 0;

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="w-16 font-medium text-neutral-300">{level}</span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className={`${textColor} font-bold`}>{solved}</span>
          <span className="text-neutral-500">{total}</span>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
          <div
            className={`${bgColor} h-full rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Main Profile Page Component
const ProfilePage = () => {
  const { userId } = useSessionUserId();
  const [profileData, setProfileData] = useState(null);
  const [totalProblemsData, setTotalProblemsData] = useState(null);
  const [activeTab, setActiveTab] = useState('Recent AC');
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const navigate = useNavigate(); // Hook for navigation
  const tabs = ['Recent AC', 'Discuss'];

  useEffect(() => {
    if (userId) {
      Promise.all([
        axios.get(`${API_BASE_URL}api/profile/${userId}`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}api/problems/counts-by-difficulty`, { withCredentials: true })
      ]).then(([profileRes, countsRes]) => {
        const fetchedData = profileRes.data;
        setProfileData(fetchedData);
        const initialEditableFormData = {
          name: fetchedData.name || '',
          college_or_company: fetchedData.college_or_company || fetchedData.company || '',
          email: fetchedData.email || '',
          bio: fetchedData.bio || '',
          google_id: fetchedData.google_id || '',
          linkedin_id: fetchedData.linkedin_id || '',
          github_id: fetchedData.github_id || '',
          portfolio_link: fetchedData.portfolio_link || '',
        };
        setFormData(initialEditableFormData);
        setPreviewPic(fetchedData.profilePic);
        setTotalProblemsData(countsRes.data);
      }).catch(error => {
        console.error("Failed to fetch page data:", error);
      });
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreviewPic(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(formData));
    if (profilePic) {
      formDataToSend.append("image", profilePic);
    }
    axios.post(API_BASE_URL + "/api/profile/edit", formDataToSend, { withCredentials: true })
      .then(() => {
        setShowEditModal(false);
        window.location.reload();
      })
      .catch((err) => console.error("Edit profile failed:", err));
  };

  if (userId === null) return <div className="text-white p-4">Please log in to view your profile.</div>;
  if (!profileData || !totalProblemsData) return <div className="text-white p-4">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-4 flex gap-4">
      {/* Left Panel */}
      <div className="w-[350px] bg-[#2b2b2b] p-6 rounded-xl border border-neutral-700/60 relative flex-shrink-0">
        <div className="flex flex-col items-center mb-6">
          <div className="relative group w-24 h-24 mb-2">
            <img
              src={profileData.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              className="rounded-full w-full h-full object-cover border-2 border-neutral-600"
              alt="Profile"
            />
          </div>
          <h2 className="text-xl font-bold">{profileData.name}</h2>
          <p className="text-sm text-neutral-400 text-center">{profileData.college_or_company}</p>
        </div>
        <button
          className="w-full bg-green-600 text-white py-1.5 px-3 rounded-lg text-sm mb-6 hover:bg-green-700 transition cursor-pointer font-semibold"
          onClick={() => setShowEditModal(true)}
        >
          Edit Profile
        </button>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Languages</h3>
          <div className="space-y-3 text-sm">
            {Object.entries(profileData.submissionsByCategory).map(([lang, count]) => (
              <div key={lang} className="flex justify-between items-center">
                <span className="bg-neutral-700 text-neutral-300 px-3 py-1 rounded-full text-xs font-medium">{lang}</span>
                <span className="text-neutral-400">{count} problems solved</span>
              </div>
            ))}
          </div>
        </div>
        <hr className="border-neutral-700/50 mb-6" />
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(profileData.submissionsByTopic).map(([topic, count]) => (
              <div key={topic} className="bg-neutral-700 text-neutral-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                {topic}
                <span className="text-neutral-400">x{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-[#2b2b2b] p-4 rounded-xl border border-neutral-700">
        <div className={`grid ${profileData.contestsParticipated > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-6`}>
          <div className="bg-[#1e1e1e] p-4 rounded-lg border border-neutral-700">
            <h4 className="text-md text-neutral-400 mb-3">Accepted Submissions</h4>
            <div className="space-y-3">
              <DifficultyBar
                level="Easy"
                solved={(profileData.acceptedByDifficulty && (profileData.acceptedByDifficulty.Easy || profileData.acceptedByDifficulty.easy)) || 0}
                total={(totalProblemsData && (totalProblemsData.Easy || totalProblemsData.easy)) || 0}
                textColor="text-green-500"
                bgColor="bg-green-500"
              />
              <DifficultyBar
                level="Medium"
                solved={(profileData.acceptedByDifficulty && (profileData.acceptedByDifficulty.Medium || profileData.acceptedByDifficulty.medium)) || 0}
                total={(totalProblemsData && (totalProblemsData.Medium || totalProblemsData.medium)) || 0}
                textColor="text-yellow-500"
                bgColor="bg-yellow-500"
              />
              <DifficultyBar
                level="Hard"
                solved={(profileData.acceptedByDifficulty && (profileData.acceptedByDifficulty.Hard || profileData.acceptedByDifficulty.hard)) || 0}
                total={(totalProblemsData && (totalProblemsData.Hard || totalProblemsData.hard)) || 0}
                textColor="text-red-600"
                bgColor="bg-red-600"
              />
            </div>
          </div>
          
          <div className="bg-[#1e1e1e] p-4 rounded-lg border border-neutral-700 flex flex-col items-center justify-center">
            <p className="text-5xl font-bold text-yellow-400">{profileData.totalSubmissions}</p>
            <h4 className="text-md text-neutral-400 mt-2">Submissions This Year</h4>
          </div>

          {profileData.contestsParticipated > 0 && (
            <div className="bg-[#1e1e1e] p-4 rounded-lg border border-neutral-700 flex flex-col items-center justify-center">
              <p className="text-5xl font-bold text-purple-400">{profileData.contestsParticipated}</p>
              <h4 className="text-md text-neutral-400 mt-2">Contests Participated</h4>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md ${activeTab === tab ? 'bg-neutral-700 text-white' : 'bg-neutral-800 text-neutral-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 👇 UPDATED SUBMISSION LIST 👇 */}
        <ul className="space-y-2">
          {profileData.recentSubmissions.slice(0, 5).map((item, idx) => (
            console.log(item),    
            <li 
              key={item.problemId || idx}
              className="flex justify-between items-center bg-[#1e1e1e] p-4 rounded-lg hover:bg-neutral-700/60 transition cursor-pointer"
              onClick={() => navigate(`/problem/${item.problemId}`)}
            >
              <span className="text-base text-neutral-200">{item.title}</span>
              <span className="text-sm text-neutral-400">{formatTimeAgo(item.submittedAt)}</span>
            </li>
          ))}
        </ul>

      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#2b2b2b] p-6 rounded-lg w-[600px] text-white border border-neutral-700">
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
            <div className="relative group w-24 h-24 mb-4 mx-auto">
              <img
                src={previewPic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="rounded-full w-full h-full object-cover border border-neutral-600"
                alt="Preview"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <FaPen />
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleProfilePicChange}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="Name" className="p-2 rounded bg-[#1e1e1e] border border-neutral-600" />
              <input name="college_or_company" value={formData.college_or_company || ''} onChange={handleInputChange} placeholder="College or Company" className="p-2 rounded bg-[#1e1e1e] border border-neutral-600" />
            </div>
            <input name="email" value={formData.email || ''} onChange={handleInputChange} placeholder="Email" className="w-full p-2 mb-4 rounded bg-[#1e1e1e] border border-neutral-600" />
            <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} placeholder="Bio" className="w-full p-2 mb-4 rounded bg-[#1e1e1e] border border-neutral-600" rows={4} />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input name="google_id" value={formData.google_id || ''} onChange={handleInputChange} placeholder="Google ID" className="p-2 rounded bg-[#1e1e1e] border border-neutral-600" />
              <input name="linkedin_id" value={formData.linkedin_id || ''} onChange={handleInputChange} placeholder="LinkedIn ID" className="p-2 rounded bg-[#1e1e1e] border border-neutral-600" />
              <input name="github_id" value={formData.github_id || ''} onChange={handleInputChange} placeholder="GitHub ID" className="p-2 rounded bg-[#1e1e1e] border border-neutral-600" />
              <input name="portfolio_link" value={formData.portfolio_link || ''} onChange={handleInputChange} placeholder="Portfolio Link" className="p-2 rounded bg-[#1e1e1e] border border-neutral-600" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;