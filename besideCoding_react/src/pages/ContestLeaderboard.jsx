import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const ContestLeaderboard = () => {
  const { contestId } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [leaderboard, setLeaderboard] = useState([]);
  const [contestName, setContestName] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // --- THIS IS THE CORRECTED API ENDPOINT ---
        // It now matches the one being blocked by Spring Security.
        const leaderboardUrl = `http://localhost:8080/api/contests/${contestId}/leaderboard`;
        const contestUrl = `http://localhost:8080/api/contests/${contestId}`;

        const [leaderboardRes, contestRes] = await Promise.all([
          axios.get(leaderboardUrl, { withCredentials: true }),
          axios.get(contestUrl, { withCredentials: true }),
        ]);
        
        setLeaderboard(leaderboardRes.data);
        setContestName(contestRes.data.title || "Unknown Contest");
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setContestName("Error loading contest");
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [contestId]);

  // Rest of your component is fine, but let's add medals like the previous suggestion for a better look!
  const getRankClass = (rank) => {
    if (rank === 1) return 'text-yellow-400 font-bold';
    if (rank === 2) return 'text-gray-300 font-bold';
    if (rank === 3) return 'text-orange-400 font-bold';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
       <button
            onClick={() => navigate(`/contest/${contestId}`)}
            className="text-gray-400 hover:text-white mb-6 transition"
        >
            ← Back to Contest
        </button>
      <h1 className="text-3xl font-bold mb-6">
        Ranking Of <span className="text-[#FFA116]">{contestName}</span>
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <p className="text-gray-500">No submissions found for this contest.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full text-left">
            <thead className="bg-gray-800 text-gray-300 text-sm uppercase">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Correct / Total</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Finish Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => (
                <tr key={user.rank} className="border-b border-gray-700 bg-gray-900 hover:bg-gray-800">
                  <td className={`px-4 py-3 ${getRankClass(user.rank)}`}>
                    {user.rank === 1 && '🥇 '}
                    {user.rank === 2 && '🥈 '}
                    {user.rank === 3 && '🥉 '}
                    {user.rank}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                  <td className="px-4 py-3">{user.correct} / {user.total}</td>
                  <td className="px-4 py-3 font-semibold">{user.score}</td>
                  <td className="px-4 py-3">{user.finishTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContestLeaderboard;