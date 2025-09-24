import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Countdown from 'react-countdown';
import { Calendar, Clock } from 'lucide-react';


// ===================================================================================
// CUSTOM HOOK: useSessionUserId
// ===================================================================================
const useSessionUserId = () => {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    axios.get(API_BASE_URL + "api/session-user", { withCredentials: true })
      .then((res) => setUserId(res.data.userId))
      .catch(() => setUserId(null));
  }, []);
  return userId;
};


// ===================================================================================
// HELPER COMPONENT: CountdownRenderer
// ===================================================================================
const CountdownRenderer = ({ days, hours, minutes, seconds, completed, label }) => {
    if (completed) {
      return <span className="font-semibold text-red-400">Contest has ended!</span>;
    }
    const formatTime = (time) => time.toString().padStart(2, '0');
    return (
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-2">{label}</p>
        <div className="flex justify-center space-x-2">
          <div className="text-center">
            <div className="bg-gray-700/50 text-white rounded-md px-2.5 py-1.5 text-xl font-bold">{formatTime(days)}</div>
            <p className="text-xs text-gray-400 mt-1">Days</p>
          </div>
          <div className="text-center">
            <div className="bg-gray-700/50 text-white rounded-md px-2.5 py-1.5 text-xl font-bold">{formatTime(hours)}</div>
            <p className="text-xs text-gray-400 mt-1">Hours</p>
          </div>
          <div className="text-center">
            <div className="bg-gray-700/50 text-white rounded-md px-2.5 py-1.5 text-xl font-bold">{formatTime(minutes)}</div>
            <p className="text-xs text-gray-400 mt-1">Mins</p>
          </div>
          <div className="text-center">
            <div className="bg-gray-700/50 text-white rounded-md px-2.5 py-1.5 text-xl font-bold">{formatTime(seconds)}</div>
            <p className="text-xs text-gray-400 mt-1">Secs</p>          
          </div>
        </div>
      </div>
    );
};


// ===================================================================================
// MAIN COMPONENT: ContestDetailPage
// ===================================================================================
const ContestDetailPage = () => {
    const { contestId } = useParams();
    const navigate = useNavigate();
    
    const userId = useSessionUserId(); 

    const [contest, setContest] = useState(null);
    const [now, setNow] = useState(new Date());
    const [hasEndedContest, setHasEndedContest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        const fetchContestAndStatus = async () => {
            setIsLoading(true);
            try {
                const contestRes = await axios.get(`${API_BASE_URL}api/contests/${contestId}`, { withCredentials: true });
                setContest(contestRes.data);

                if (userId) {
                    const statusRes = await axios.get(`${API_BASE_URL}api/contest-participant/status`, {
                        params: { userId, contestId },
                        withCredentials: true
                    });
                    setHasEndedContest(statusRes.data.hasEnded);
                }
            } catch (error) { 
                console.error('Failed to fetch contest details or status:', error); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchContestAndStatus();
        
        const interval = setInterval(() => setNow(new Date()), 1000);
        
        return () => clearInterval(interval);
    }, [contestId, userId]);

    const handleJoinContest = async () => {
        if (!userId) {
            alert("Please log in to join the contest.");
            navigate('/login');
            return;
        }
        
        setIsJoining(true);
        try {
            const params = new URLSearchParams();
            params.append('userId', userId);
            params.append('contestId', contestId);

            await axios.post(`${API_BASE_URL}api/contest-participant/join`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true,
            });
            
            navigate(`/contest/${contestId}/problem-list`, { 
                state: { contestName: contest.title, endTime: contest.endTime }
            });

        } catch (error) {
            console.error("Failed to join contest:", error);
            if (error.response && error.response.status === 403) {
                alert("You have already completed this contest and cannot rejoin.");
                setHasEndedContest(true); 
            } else {
                alert("An error occurred while trying to join the contest.");
            }
        } finally {
            setIsJoining(false);
        }
    };
    
    const handleViewSolutions = () => {
        axios.get(`${API_BASE_URL}api/contests/${contestId}/problems`, { withCredentials: true })
            .then(res => 
                navigate(`/contest/${contestId}/solutions/0`, { 
                    state: { problems: res.data, contestId, contestName: contest.title } 
                })
            )
            .catch(err => console.error("Failed to fetch problems for solutions view:", err));
    };

    const formatDateTime = (dateString, part) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (part === 'date') {
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
        if (part === 'time') {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        }
        return '';
    };

    if (isLoading) {
        return <div className="min-h-screen bg-[#0e0e0e] text-white p-6 text-center">Loading Contest Details...</div>;
    }
    
    if (!contest) {
        return <div className="min-h-screen bg-[#0e0e0e]  p-6 text-center text-red-500">Failed to load contest. It may not exist.</div>;
    }

    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    const isBeforeStart = now < start;
    const isLive = now >= start && now < end;
    const isAfterEnd = now > end;
    const cannotParticipate = hasEndedContest || isJoining;
    
    const countdownKey = isBeforeStart ? 'start' : 'end';

    const themes = {
        live: { accent: 'text-yellow-400', bg: 'bg-[#2a271c]', border: 'border-yellow-600/50', button: 'bg-yellow-600 hover:bg-yellow-700', statusBadge: 'bg-yellow-600' },
        upcoming: { accent: 'text-purple-400', bg: 'bg-[#241c2e]', border: 'border-purple-700/50', button: 'bg-purple-600 hover:bg-purple-700', statusBadge: 'bg-purple-600' },
        ended: { accent: 'text-gray-400', bg: 'bg-[#181818]', border: 'border-gray-700', button: 'bg-gray-700 text-gray-400 cursor-not-allowed', statusBadge: 'bg-gray-600' }
    };
    
    let currentTheme = themes.upcoming;
    if (isLive) currentTheme = themes.live;
    if (isAfterEnd) currentTheme = themes.ended;

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-10">
            <div className="max-w-4xl mx-auto">

                <button 
                    onClick={() => navigate('/contest')} 
                    className="text-gray-400 hover:text-white mb-6 transition"
                >
                    ← Back to Contests
                </button>

                <h1 className={`text-4xl md:text-5xl font-bold ${currentTheme.accent} mb-4`}>
                    {contest.title}
                </h1>
                
                <div className={`${currentTheme.bg} ${currentTheme.border} rounded-lg p-6 mb-10 grid md:grid-cols-3 gap-6 items-center text-center`}>
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Starts</h3>
                        <div className="flex items-center gap-2 text-gray-200"><Calendar size={16} /><span>{formatDateTime(contest.startTime, 'date')}</span></div>
                        <div className="flex items-center gap-2 text-gray-200"><Clock size={16} /><span>{formatDateTime(contest.startTime, 'time')}</span></div>
                    </div>

                    <div className="border-y md:border-x md:border-y-0 border-gray-700 py-4 md:py-0 md:px-6">
                        {!isAfterEnd ? (
                             <Countdown 
                                key={countdownKey} 
                                date={isBeforeStart ? start : end} 
                                renderer={(props) => <CountdownRenderer {...props} label={isBeforeStart ? 'Starts in' : 'Ends in'} />} 
                             />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <span className={`px-3 py-1 text-sm font-bold text-white ${currentTheme.statusBadge} rounded-full`}>Ended</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center md:items-end">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Ends</h3>
                        <div className="flex items-center gap-2 text-gray-200"><Calendar size={16} /><span>{formatDateTime(contest.endTime, 'date')}</span></div>
                        <div className="flex items-center gap-2 text-gray-200"><Clock size={16} /><span>{formatDateTime(contest.endTime, 'time')}</span></div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-10">
                    <button 
                        onClick={handleJoinContest}
                        // The disabled logic remains the same, as it correctly handles all cases
                        disabled={!isLive || cannotParticipate} 
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${(!isLive || cannotParticipate) ? themes.ended.button : currentTheme.button}`}
                    >
                        {
                            // --- THIS IS THE UPDATED LOGIC FOR THE BUTTON TEXT ---
                            // 1. Check if the contest is globally over first.
                            isAfterEnd ? 'Ended' 
                            // 2. If not, check if it's currently live.
                            : isLive ? 
                                // 3. If live, check the user's personal status.
                                (hasEndedContest ? 'Contest Ended For You' : (isJoining ? 'Joining...' : '✓ Join Now')) 
                            // 4. If not over and not live, it must be upcoming.
                            : 'Join (Disabled)'
                        }
                    </button>
                    <button 
                        onClick={handleJoinContest}
                        disabled={isBeforeStart || (isLive && cannotParticipate)}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg border font-medium transition-all ${(isBeforeStart || (isLive && hasEndedContest)) ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : 'bg-[#1e1e1e] hover:bg-[#2e2e2e] text-white border-gray-600'}`}
                    >
                        <span>☰</span> View Problems
                    </button>
                    <button 
                        onClick={() => { if (!isBeforeStart) { navigate(`/contest/${contestId}/leaderboard`, { state: { contestId, contestName: contest.title } }); }}} 
                        disabled={isBeforeStart} 
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg border font-medium transition-all ${isBeforeStart ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : 'bg-[#1e1e1e] hover:bg-[#2e2e2e] text-white border-gray-600'}`}
                    >
                        <span>📊</span> View Leaderboard
                    </button>
                    {isAfterEnd && (
                        <button 
                            onClick={handleViewSolutions} 
                            className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all bg-green-600 hover:bg-green-700 text-white border border-green-500"
                        >
                            <span>💡</span> View Solutions
                        </button>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#181818] border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2 text-white">Description</h2>
                        <p className="text-gray-300 text-sm">{contest.description || 'No description provided.'}</p>
                    </div>
                    <div className="bg-[#181818] border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2 text-white">Contest Rules</h2>
                        <ul className="text-gray-300 text-sm list-disc ml-5 space-y-1">
                            <li>Contest duration is determined by the start and end times.</li>
                            <li>No plagiarism or cheating will be tolerated.</li>
                            <li>Follow all community guidelines.</li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-10 text-center text-yellow-400 font-semibold tracking-wide">
                    🚀 Weekly Contest • Powered by BesideCoding
                </div>
            </div>
        </div>
    );
};

export default ContestDetailPage;