import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- SVG ICONS (Complete Set) ---
const ListIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
const DocumentTextIcon = ({ className = "w-4 h-4" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>);
const CodeBracketIcon = ({ className = "w-4 h-4" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>);
const TopicsIconTag = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>);
const CompaniesIconTag = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>);
const LikeOutlineIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 0 0-6 0v4H5.5A1.5 1.5 0 0 0 4 10.5v2.25a1.5 1.5 0 0 0 1.5 1.5H8v6.25a1.25 1.25 0 0 0 2.5 0V14h3.25a2.25 2.25 0 0 0 2.25-2.25V11a2 2 0 0 0-2-2h-1z" /></svg>);
const LikeSolidIcon = ({ className = "w-5 h-5 text-blue-500" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M14 9V5a3 3 0 0 0-6 0v4H5.5A1.5 1.5 0 0 0 4 10.5v2.25a1.5 1.5 0 0 0 1.5 1.5H8v6.25a1.25 1.25 0 0 0 2.5 0V14h3.25a2.25 2.25 0 0 0 2.25-2.25V11a2 2 0 0 0-2-2h-1z" /></svg>);
const DislikeOutlineIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15v4a3 3 0 0 0 6 0v-4h3.5a1.5 1.5 0 0 0 1.5-1.5v-2.25a1.5 1.5 0 0 0-1.5-1.5H16V4.25a1.25 1.25 0 0 0-2.5 0V10h-3.25A2.25 2.25 0 0 0 8 12.25v.75a2 2 0 0 0 2 2h1z" /></svg>);
const DislikeSolidIcon = ({ className = "w-5 h-5 text-red-500" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M10 15v4a3 3 0 0 0 6 0v-4h3.5a1.5 1.5 0 0 0 1.5-1.5v-2.25a1.5 1.5 0 0 0-1.5-1.5H16V4.25a1.25 1.25 0 0 0-2.5 0V10h-3.25A2.25 2.25 0 0 0 8 12.25v.75a2 2 0 0 0 2 2h1z" /></svg>);
const ChevronDownIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>);

// --- HELPER FUNCTIONS ---
const formatCount = (num) => {
    if (num === null || num === undefined) return "0";
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    return num.toString();
};

const useSessionUserId = () => {
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        axios.get("http://localhost:8080/api/session-user", { withCredentials: true })
            .then((res) => setUserId(res.data.userId))
            .catch(() => setUserId(null));
    }, []);
    return userId;
};


const ContestSolutionPage = () => {
    const userId = useSessionUserId();
    const { contestId, problemIndex } = useParams();
    const navigate = useNavigate();
    const currentIndex = parseInt(problemIndex, 10);

    // State
    const [problems, setProblems] = useState([]);
    const [activeTab, setActiveTab] = useState("description");
    const [showTopics, setShowTopics] = useState(true);
    const [showCompanies, setShowCompanies] = useState(false);
    const [userLikeStatus, setUserLikeStatus] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);

    // Refs
    const leftPanelRef = useRef(null);

    // Fetch all problem and submission data in one call
    useEffect(() => {
        if (userId && contestId) {
            axios.get(`http://localhost:8080/api/contests/${contestId}/submissions`, { params: { userId }, withCredentials: true })
            .then((res) => setProblems(res.data))
            .catch((err) => {
                console.error("Error fetching contest submissions:", err);
                toast.error("Could not load solutions.");
            });
        }
    }, [userId, contestId]);

    const problem = problems[currentIndex];

    // Fetch like/dislike data for the current problem when it changes
    useEffect(() => {
        if (problem?.id && userId) {
            axios.get(`http://localhost:8080/api/problems/${problem.id}/interactions`, { params: { userId }, withCredentials: true })
            .then((response) => {
                const { userStatus, likes, dislikes } = response.data;
                setUserLikeStatus(userStatus);
                setLikeCount(likes || 0);
                setDislikeCount(dislikes || 0);
            })
            .catch((error) => console.error("Error fetching interaction status:", error));
        }
    }, [problem?.id, userId]);

    const handleInteraction = async (clickedInteractionType) => {
        if (!userId) return toast.error("You must be logged in to interact.");
        if (!problem?.id) return;

        const statusToSend = userLikeStatus === clickedInteractionType ? null : clickedInteractionType;
        try {
            const res = await axios.post(`http://localhost:8080/api/problems/${problem.id}/interact`, {
                userId, status: statusToSend,
            }, { withCredentials: true });

            setLikeCount(res.data.likes);
            setDislikeCount(res.data.dislikes);
            setUserLikeStatus(res.data.userStatus);
        } catch (err) {
            toast.error("Interaction failed.");
        }
    };

    const handleNavigateToProblem = (index) => {
        if (index >= 0 && index < problems.length) {
            navigate(`/contest/${contestId}/solutions/${index}`);
        }
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = leftPanelRef.current.getBoundingClientRect().width;
        const handleMouseMove = (moveEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            const parentWidth = leftPanelRef.current.parentElement.offsetWidth;
            // Prevent panel from becoming too small or too large
            if (newWidth > 300 && newWidth < parentWidth - 300) {
                leftPanelRef.current.style.width = `${newWidth}px`;
            }
        };
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    if (!problem) {
        return <div className="h-screen bg-[#1e1e1e] text-white flex items-center justify-center">Loading solution...</div>;
    }

    // --- LOGGING FOR DEBUGGING ---
    console.log("Current Problem Data:", problem);

    // --- DERIVED STATE ---
    const isMCQ = problem.problemType === "MCQ";
    const userAnswerForThisProblem = problem.userAnswer;
    const isCorrect = userAnswerForThisProblem === problem.correctAnswer;
    const wasAttempted = userAnswerForThisProblem !== null && userAnswerForThisProblem !== undefined;
    const submissionStatus = wasAttempted ? (isCorrect ? 'Correct' : 'Incorrect') : 'Not Answered';
    
    // Safely parse additionalInfo for MCQ options
    const additionalInfo = problem.additionalInfo ? JSON.parse(problem.additionalInfo) : {};

    const companies = (problem.company || '').split(",").map(c => c.trim()).filter(Boolean);
    const subCategories = (problem.subCategory || '').split(",").map(s => s.trim()).filter(Boolean);

    return (
        <div className="h-screen bg-[#1e1e1e] text-white flex flex-col overflow-hidden">
            <header className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-neutral-700 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white">BesideCoding</h1>
                    <button onClick={() => navigate(`/contest/${contestId}`)} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white hover:bg-neutral-700 px-3 py-1.5 rounded-md transition-colors"><ListIcon /> Back to Contest</button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {problems.map((p, idx) => {
                        const attempted = p.userAnswer !== null && p.userAnswer !== undefined;
                        const correct = attempted && p.userAnswer === p.correctAnswer;
                        const statusClass = attempted
                            ? (correct ? "bg-green-600 border-green-500" : "bg-red-600 border-red-500")
                            : "bg-[#333] border-neutral-600 hover:bg-neutral-600";
                        return <button key={p.id} onClick={() => handleNavigateToProblem(idx)} className={`w-8 h-8 rounded-full text-sm font-semibold border text-white transition-all duration-200 ${idx === currentIndex ? "scale-110 shadow-lg" : ""} ${statusClass}`} title={`Problem ${idx + 1}`}>{idx + 1}</button>
                    })}
                </div>
                <div className="text-lg font-bold text-red-500 w-48 text-right">Contest Ended</div>
            </header>

            <main className="flex flex-row flex-grow h-full w-full p-2 gap-2">
                <div ref={leftPanelRef} className="h-full rounded-lg border border-neutral-700 bg-[#252526] flex flex-col overflow-hidden" style={{ width: '50%' }}>
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#2d2d2d] border-b border-neutral-700 shrink-0">
                        <button className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded ${activeTab === 'description' ? 'text-white bg-[#373737]' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab('description')}><DocumentTextIcon /> Description</button>
                        <button className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded ${activeTab === 'solution' ? 'text-white bg-[#373737]' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab('solution')}><CodeBracketIcon /> Solution</button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 pr-2">
                        {activeTab === "description" && (
                            <div className="space-y-7">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-xl font-semibold text-gray-100">{currentIndex + 1}. {problem.title}</h2>
                                        {wasAttempted && <span className={`text-xs font-bold px-3 py-1 rounded-full ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{submissionStatus}</span>}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${problem.difficulty === "Easy" ? "bg-emerald-600/20 text-emerald-400" : problem.difficulty === "Medium" ? "bg-yellow-600/20 text-yellow-400" : "bg-red-600/20 text-red-400"}`}>{problem.difficulty}</span>
                                        {subCategories.length > 0 && <button onClick={() => setShowTopics(true)} className="flex items-center gap-1 bg-[#373737] text-gray-300 text-xs px-2 py-1 rounded-full hover:bg-[#4a4a4a] transition-colors"><TopicsIconTag /> Topics</button>}
                                        {companies.length > 0 && <button onClick={() => setShowCompanies(true)} className="flex items-center gap-1 bg-[#373737] text-yellow-500 text-xs px-2 py-1 rounded-full hover:bg-[#4a4a4a] transition-colors"><CompaniesIconTag /> Companies</button>}
                                    </div>
                                </div>
                                <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">{problem.description}</pre>
                                
                                {subCategories.length > 0 && (
                                    <div className="border-t border-neutral-700 pt-5">
                                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowTopics(!showTopics)}>
                                            <h3 className="text-sm font-semibold text-gray-300">Topics</h3>
                                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${showTopics ? 'rotate-180' : ''}`} />
                                        </div>
                                        {showTopics && (
                                            <div className="flex flex-wrap gap-2 pt-3">
                                                {subCategories.map((sub, idx) => (<span key={idx} className="bg-[#373737] text-gray-300 text-xs px-2.5 py-1 rounded-full">{sub}</span>))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {companies.length > 0 && (
                                    <div className="border-t border-neutral-700 pt-5">
                                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowCompanies(!showCompanies)}>
                                            <h3 className="text-sm font-semibold text-yellow-500">Companies</h3>
                                            <ChevronDownIcon className={`w-5 h-5 text-yellow-500 transition-transform ${showCompanies ? 'rotate-180' : ''}`} />
                                        </div>
                                        {showCompanies && (
                                            <div className="flex flex-wrap gap-2 pt-3">
                                                {companies.map((c, idx) => (<span key={idx} className="bg-[#373737] text-yellow-500 text-xs px-2.5 py-1 rounded-full">{c}</span>))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "solution" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3">Official Solution</h2>
                                <pre className="whitespace-pre-wrap text-sm border border-neutral-600 bg-[#1e1e1e] rounded p-4 leading-relaxed">{problem.solution || 'Solution not available.'}</pre>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-start gap-1 px-4 py-2 border-t border-neutral-700 shrink-0">
                        <button onClick={() => handleInteraction('LIKE')} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white p-1.5 rounded hover:bg-neutral-700">
                            <LikeOutlineIcon className={`w-4 h-4 ${userLikeStatus === 'LIKE' ? 'hidden' : 'block'}`} />
                            <LikeSolidIcon className={`w-4 h-4 ${userLikeStatus === 'LIKE' ? 'block' : 'hidden'}`} />
                            <span>{formatCount(likeCount)}</span>
                        </button>
                        <button onClick={() => handleInteraction('DISLIKE')} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white p-1.5 rounded hover:bg-neutral-700">
                            <DislikeOutlineIcon className={`w-4 h-4 ${userLikeStatus === 'DISLIKE' ? 'hidden' : 'block'}`} />
                            <DislikeSolidIcon className={`w-4 h-4 ${userLikeStatus === 'DISLIKE' ? 'block' : 'hidden'}`} />
                            <span>{formatCount(dislikeCount)}</span>
                        </button>
                    </div>
                </div>

                <div onMouseDown={handleMouseDown} className="w-2 h-full flex-shrink-0 rounded-lg cursor-col-resize flex items-center justify-center group bg-neutral-800 hover:bg-blue-600 active:bg-blue-700 transition-colors duration-150">
                    <div className="w-1 h-8 bg-neutral-600 rounded-full group-hover:bg-white transition-colors"></div>
                </div>
                
                <div className="h-full rounded-lg border border-neutral-700 bg-[#252526] flex flex-col overflow-hidden flex-1 p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-100">Result</h3>
                    <div className="flex-grow overflow-y-auto pr-2">
                        {isMCQ ? (
                            <div className="space-y-3">
                                {!wasAttempted && <p className="text-gray-400 text-sm mb-4">You did not attempt this question. The correct answer is shown below.</p>}
                                {additionalInfo.options?.map((opt, idx) => {
                                    const isCorrectAnswer = opt === problem.correctAnswer;
                                    const isUserAnswer = opt === userAnswerForThisProblem;
                                    let style = "border-neutral-700 bg-[#1e1e1e] text-gray-300";
                                    if (isCorrectAnswer) style = "border-green-500 bg-green-500/20 text-white";
                                    else if (isUserAnswer) style = "border-red-500 bg-red-500/20 text-white";
                                    
                                    return (
                                        <div key={idx} className={`p-3 rounded-lg border-2 transition-all ${style}`}>
                                            <span className="font-mono">{String.fromCharCode(65 + idx)}.</span> {opt}
                                            {isCorrectAnswer && <span className="text-xs font-bold text-green-400 ml-2">(Correct)</span>}
                                            {isUserAnswer && !isCorrectAnswer && <span className="text-xs font-bold text-red-400 ml-2">(Your Choice)</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="space-y-4 text-sm">
                                {isCorrect ? (
                                    <div>
                                        <label className="block text-gray-400 mb-1">Your Answer (Correct)</label>
                                        <div className="p-3 rounded-lg border border-green-500/50 bg-green-900/20"><pre className="whitespace-pre-wrap">{userAnswerForThisProblem}</pre></div>
                                    </div>
                                ) : wasAttempted ? (
                                    <>
                                        <div>
                                            <label className="block text-gray-400 mb-1">Your Answer (Incorrect)</label>
                                            <div className="p-3 rounded-lg border border-red-500/50 bg-red-900/20"><pre className="whitespace-pre-wrap">{userAnswerForThisProblem}</pre></div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-1">Correct Answer</label>
                                            <div className="p-3 rounded-lg border border-green-500/50 bg-green-900/20"><pre className="whitespace-pre-wrap">{problem.correctAnswer}</pre></div>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-gray-400 mb-1">Not Answered. The correct answer was:</label>
                                        <div className="p-3 rounded-lg border border-green-500/50 bg-green-900/20"><pre className="whitespace-pre-wrap">{problem.correctAnswer}</pre></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 shrink-0">
                        <button onClick={() => handleNavigateToProblem(currentIndex - 1)} disabled={currentIndex === 0} className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50">⬅️ Previous</button>
                        <button onClick={() => handleNavigateToProblem(currentIndex + 1)} disabled={currentIndex === problems.length - 1} className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">Next ➡️</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContestSolutionPage;