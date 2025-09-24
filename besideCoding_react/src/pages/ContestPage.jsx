import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Countdown from 'react-countdown';
import { useNavigate } from 'react-router-dom';
import { Award, Clock, Timer, Users, Zap } from 'lucide-react';

// ... CountdownRenderer and other helper components/hooks remain the same ...
const CountdownRenderer = ({ days, hours, minutes, seconds, completed, label, isParentLive }) => {
  if (completed) {
    if (!isParentLive) {
      return <span className="font-semibold text-yellow-400">Starting...</span>;
    }
    return <span className="font-semibold text-red-400">Contest has ended!</span>;
  }
  const formatTime = (time) => time.toString().padStart(2, '0');
  return (
    <div className="text-center">
      <p className="text-sm text-gray-300 mb-2">{label}</p>
      <div className="flex justify-center space-x-2 md:space-x-3">
        <div className="text-center">
          <div className="bg-gray-700 text-white rounded-md px-2 py-1.5 md:px-3 md:py-2 text-2xl md:text-3xl font-bold">{formatTime(days)}</div>
          <p className="text-xs text-gray-400 mt-1">Days</p>
        </div>
        <div className="text-center">
          <div className="bg-gray-700 text-white rounded-md px-2 py-1.5 md:px-3 md:py-2 text-2xl md:text-3xl font-bold">{formatTime(hours)}</div>
          <p className="text-xs text-gray-400 mt-1">Hours</p>
        </div>
        <div className="text-center">
          <div className="bg-gray-700 text-white rounded-md px-2 py-1.5 md:px-3 md:py-2 text-2xl md:text-3xl font-bold">{formatTime(minutes)}</div>
          <p className="text-xs text-gray-400 mt-1">Mins</p>
        </div>
        <div className="text-center">
          <div className="bg-gray-700 text-white rounded-md px-2 py-1.5 md:px-3 md:py-2 text-2xl md:text-3xl font-bold">{formatTime(seconds)}</div>
          <p className="text-xs text-gray-400 mt-1">Secs</p>
        </div>
      </div>
    </div>
  );
};


const ContestPage = () => {
  const [activeAndUpcomingContests, setActiveAndUpcomingContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const navigate = useNavigate();

  const fetchContests = useCallback(async () => {
    try {
      const [activeRes, upcomingRes, pastRes] = await Promise.all([
        axios.get(API_BASE_URL + '/api/contests/active', { withCredentials: true }),
        axios.get(API_BASE_URL + '/api/contests/upcoming', { withCredentials: true }),
        axios.get(API_BASE_URL + '/api/contests/past', { withCredentials: true })
      ]);
      
      const active = Array.isArray(activeRes.data) ? activeRes.data : [];
      const upcoming = Array.isArray(upcomingRes.data) ? upcomingRes.data : [];
      const past = Array.isArray(pastRes.data) ? pastRes.data : [];
      
      setActiveAndUpcomingContests([...active, ...upcoming]);
      setPastContests(past);

    } catch (err) {
      console.error('Error fetching contests:', err);
    }
  }, []);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  const handleContestClick = (id) => {
    navigate(`/contest/${id}`);
  };

  const formatDateTime = (isoString, part) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (part === 'date') return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    if (part === 'time') return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
    return '';
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return null;
    const diffInMs = new Date(end) - new Date(start);
    if (diffInMs < 0) return null;
    return Math.round(diffInMs / 60000);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8 md:px-10">
      <div className="text-center mb-12">
        <div className="text-yellow-400 text-6xl">🏆</div>
        <h1 className="text-4xl md:text-5xl font-bold mt-3">
          besideCoding <span className="text-gray-300">Contests</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Compete every week and see where you stand!
        </p>
      </div>

      {activeAndUpcomingContests.length > 0 && (
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Zap className="text-yellow-400" /> Active & Upcoming Contests
          </h2>
          <div className="space-y-6">
            {activeAndUpcomingContests.map((contest) => {
              const now = new Date();
              const startTime = new Date(contest.startTime);
              const endTime = contest.endTime ? new Date(contest.endTime) : null;
              const isLive = now >= startTime && endTime && now < endTime;
              const cardStyle = isLive 
                ? "bg-[#2a271c] border-yellow-600/50" : "bg-[#241c2e] border-purple-700/50";
              const dateStyle = isLive ? "text-yellow-300" : "text-purple-300";
              const buttonStyle = isLive 
                ? "bg-yellow-600 hover:bg-yellow-700" : "bg-purple-600 hover:bg-purple-700";

              return (
                <div key={contest.id} className={`${cardStyle} p-5 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-center`}>
                  <div className="md:col-span-2 flex flex-col h-full">
                    <p className={`text-sm ${dateStyle} font-medium mb-2`}>{formatDateTime(contest.startTime, 'date')}</p>
                    <h3 className="text-2xl font-bold text-white mb-2">{contest.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{contest.description}</p>
                    <div className="mt-auto flex items-center space-x-4 text-gray-300">
                      <div className="flex items-center gap-1.5"><Clock size={16} /><span className="text-sm">Starts at {formatDateTime(contest.startTime, 'time')}</span></div>
                      <div className="flex items-center gap-1.5"><Timer size={16} /><span className="font-bold text-sm">{calculateDuration(contest.startTime, contest.endTime)} min</span></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Countdown
                      date={isLive ? endTime : startTime}
                      renderer={(props) => <CountdownRenderer {...props} label={isLive ? 'Ends in' : 'Starts in'} isParentLive={isLive} />}
                      onComplete={() => {
                        setTimeout(() => fetchContests(), 1000);
                      }}
                    />
                    <button onClick={() => handleContestClick(contest.id)} className={`w-full ${buttonStyle} text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300`}>
                      {isLive ? 'Enter Contest' : 'View Details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 👇 PAST CONTESTS SECTION REFACTORED FOR FINAL ALIGNMENT FIX 👇 */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Award className="text-gray-500" /> Past Contests
        </h2>
        <div className="bg-[#1e1e1e] border border-gray-700/80 rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm">
                <th className="p-4 font-semibold w-2/5">CONTEST</th>
                <th className="p-4 font-semibold">START TIME</th>
                <th className="p-4 font-semibold text-center">DURATION</th>
                <th className="p-4 font-semibold text-center">PARTICIPANTS</th>
                <th className="p-4 font-semibold text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {pastContests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 py-8">
                    No past contests available yet.
                  </td>
                </tr>
              ) : (
                pastContests.map((contest) => {
                  const duration = calculateDuration(contest.startTime, contest.endTime);
                  return (
                    <tr key={contest.id} className="border-b border-gray-800 last:border-b-0">
                      <td className="p-4 align-top">
                        <h3 className="font-semibold text-white text-base">{contest.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-1">{contest.description}</p>
                      </td>
                      <td className="p-4 align-top">
                        <p className="font-medium text-gray-200 text-sm">{formatDateTime(contest.startTime, 'date')}</p>
                        <p className="text-sm text-gray-400">{formatDateTime(contest.startTime, 'time')}</p>
                      </td>
                      <td className="p-4 text-center align-middle">
                        <div className="flex items-center justify-center gap-2 text-gray-300">
                          <Timer size={16} />
                          {duration ? (
                            <span className="font-medium text-sm">{duration} min</span>
                          ) : (
                            <span className="font-medium text-sm">—</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center align-middle">
                         <div className="flex items-center justify-center gap-2 text-gray-300">
                           <Users size={16} />
                           <span className="font-medium text-sm">{contest.participantCount}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center align-middle">
                        <button onClick={() => handleContestClick(contest.id)} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm">
                          View Results
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContestPage;