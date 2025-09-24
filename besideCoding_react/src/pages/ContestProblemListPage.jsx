import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../Constants';


const ContestProblemListPage = () => {
    const { contestId } = useParams();
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [contest, setContest] = useState(null);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const fetchContestAndProblems = async () => {
            try {
                const contestRes = await axios.get(`http://localhost:8080/api/contests/${contestId}`, {
                    withCredentials: true,
                });
                setContest(contestRes.data);

                const problemsRes = await axios.get(`http://localhost:8080/api/contests/${contestId}/problems`, {
                    withCredentials: true,
                });
                setProblems(problemsRes.data);
            } catch (err) {
                console.error('Error loading contest problems:', err);
                // Optionally, show a toast or error message to the user
            }
        };

        fetchContestAndProblems();
        // This interval is for checking the start time in real-time
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, [contestId]);

    if (!contest) {
        return (
            <div className="min-h-screen bg-[#0e0e0e] text-white p-6 flex items-center justify-center">
                <p className="text-xl">Loading Contest...</p>
            </div>
        );
    }

    const startTime = new Date(contest.startTime);
    const isBeforeStart = now < startTime;

    return (
        <div className="min-h-screen bg-[#1e1e1e] text-white px-4 py-8 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4 text-yellow-400">📝 {contest.title} - Problem List</h1>
                {/* <p className="text-yellow-400 mb-6">Contest Problems</p> */}

                {isBeforeStart ? (
                    <div className="text-center text-red-400 bg-[#252526] p-6 rounded-lg border border-neutral-700">
                        <p className="text-xl font-semibold">Contest Has Not Started Yet</p>
                        <p className="text-gray-400 mt-2">Problems will be visible when the contest goes live.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {problems.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No problems are available for this contest.</p>
                        ) : (
                            problems.map((problem, index) => (
                                <div
                                    key={problem.id}
                                    onClick={() => {
                                        const nowTime = new Date();
                                        const contestEnd = new Date(contest.endTime);

                                        if (nowTime > contestEnd) {
                                            navigate(`/problem/${problem.id}`);
                                        } else {
                                            navigate(`/contest/${contestId}/problem/${index}`, {
                                                state: {
                                                    problems,
                                                    currentIndex: index,
                                                    endTime: contest.endTime,
                                                    contestId,
                                                }
                                            });
                                        }
                                    }}

                                    className="cursor-pointer bg-[#252526] border border-neutral-700 p-4 rounded-lg hover:bg-[#333] hover:border-neutral-600 transition-all duration-200"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            {/* --- KEY CHANGE HERE --- */}
                                            <span className="text-lg font-medium text-gray-400">{index + 1}.</span>
                                            <h2 className="text-lg font-semibold text-gray-200">{problem.title}</h2>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContestProblemListPage;