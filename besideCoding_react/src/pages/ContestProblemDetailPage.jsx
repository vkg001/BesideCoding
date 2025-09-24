import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- SVG Icons ---
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

// --- Custom Hook to get User ID ---
const useSessionUserId = () => {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    axios.get("${API_BASE_URL}api/session-user", { withCredentials: true })
      .then((res) => setUserId(res.data.userId))
      .catch(() => setUserId(null));
  }, []);
  return userId;
};

// --- Main Component ---
const ContestProblemDetailPage = () => {
  const userId = useSessionUserId();
  const { contestId: routeContestId, problemIndex } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const contestId = location.state?.contestId || routeContestId;
  const problems = location.state?.problems || [];
  const endTime = location.state?.endTime;
  const currentIndex = parseInt(problemIndex, 10);
  const problem = problems[currentIndex];

  const [selectedOption, setSelectedOption] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState(location.state?.answers || {});
  const [timeLeft, setTimeLeft] = useState("");
  
  // UPDATED: Added loading state for the end contest action
  const [isEnding, setIsEnding] = useState(false);

  const leftPanelRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    if (!problem) return;
    setSelectedOption("");
    setUserAnswer("");
  }, [currentIndex, problem]);

  // UPDATED: Timer effect now calls a functional handleAutoSubmit
  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        handleAutoSubmit(); // Call the actual submission logic
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, userId, contestId]); // Added dependencies for handleAutoSubmit


  // --- NAVIGATION & SUBMISSION HANDLERS ---

  const handleNavigateToProblem = (index) => {
    if (index >= 0 && index < problems.length) {
      navigate(`/contest/${contestId}/problem/${index}`, {
        state: { problems, endTime, contestId, answers },
      });
    }
  };

  // UPDATED: This is the core new logic for ending the contest.
  const handleFinalSubmit = async (isAutoSubmit = false) => {
    if (!isAutoSubmit) {
      const confirmed = window.confirm("Are you sure you want to end the contest? This action cannot be undone.");
      if (!confirmed) {
        return; // User cancelled the action
      }
    }

    if (!userId) {
      toast.error("User session not found. Cannot end contest.");
      return;
    }

    setIsEnding(true);
    toast.info("📤 Submitting your final attempt and finishing the contest...");

    try {
      const params = new URLSearchParams();
      params.append('userId', userId);
      params.append('contestId', contestId);

      // Call the backend endpoint to mark the user's participation as 'ended'
      await axios.post(`${API_BASE_URL}api/contest-participant/end`, params, { withCredentials: true });

      toast.success("🎉 Contest ended successfully! Redirecting to the leaderboard.");

      // Navigate to the leaderboard after a short delay so the user can see the toast
      setTimeout(() => {
        navigate(`/contest/${contestId}/leaderboard`, {
          state: { contestId, contestName: location.state?.contestName },
        });
      }, 1500);

    } catch (error) {
      console.error("Failed to end contest:", error);
      toast.error("❌ An error occurred while ending the contest. Please try again.");
      setIsEnding(false); // Reset loading state on failure
    }
  };

  // UPDATED: handleAutoSubmit now properly wraps handleFinalSubmit
  const handleAutoSubmit = () => {
    toast.error("⏱️ Time's up! The contest is being submitted automatically.");
    handleFinalSubmit(true); // Call final submit logic, bypassing the confirmation dialog
  };

  const handleSubmitAndNext = async () => {
    const answer = problem.problemType === "MCQ" ? selectedOption : userAnswer.trim();
    if (!answer) {
      toast.error("Please provide an answer before submitting.");
      return;
    }

    try {
      await axios.post("${API_BASE_URL}api/submit-contest", {
        userId,
        contestId,
        problemId: problem.id,
        answer
      }, { withCredentials: true });

      toast.success(`Problem ${currentIndex + 1} Submitted!`);

      const newAnswers = { ...answers, [currentIndex]: true };
      setAnswers(newAnswers);

      if (currentIndex < problems.length - 1) {
        navigate(`/contest/${contestId}/problem/${currentIndex + 1}`, {
          state: { problems, endTime, contestId, answers: newAnswers },
        });
      } else {
        toast.info("🎉 You've submitted the last question. Click 'End Contest' when you’re ready.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("❌ Submission failed. Please try again.");
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftPanelRef.current.offsetWidth;
    const handleMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      const parentWidth = leftPanelRef.current.parentElement.offsetWidth;
      if (newWidth > parentWidth * 0.25 && newWidth < parentWidth * 0.75) {
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

  // --- RENDER LOGIC ---

  if (!problem) {
    return (
      <div className="h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center">
        <p className="text-xl">⚠️ Loading problem or contest data...</p>
        <button
          onClick={() => navigate(`/contest/${contestId}`)}
          className="mt-4 bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Contest
        </button>
      </div>
    );
  }

  const isMCQ = problem.problemType === "MCQ";

  return (
    <div className="h-screen bg-[#1e1e1e] text-white flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-neutral-700 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">BesideCoding</h1>
          <button
            onClick={() => navigate(`/contest/${contestId}/problem-list`)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white hover:bg-neutral-700 px-3 py-1.5 rounded-md transition-colors">
            <ListIcon />
            Problem List
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {problems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigateToProblem(idx)}
              className={`w-8 h-8 rounded-full text-sm font-semibold border transition-all duration-200 ${idx === currentIndex
                ? "bg-yellow-400 text-black border-yellow-400 scale-110 shadow-lg"
                : answers[idx]
                  ? "bg-green-600 text-white border-green-500"
                  : "bg-[#333] text-white border-neutral-600 hover:bg-neutral-600"
                }`}
              title={`Go to Problem ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="text-lg font-bold text-yellow-400 w-48 text-right">
          Time Left: {timeLeft}
        </div>
      </header>

      {/* Main Content Area (Resizable Panels) */}
      <main className="flex flex-row flex-grow h-full w-full p-2 gap-2">
        {/* Left Panel: Problem Description */}
        <div
          ref={leftPanelRef}
          className="h-full rounded-lg border border-neutral-700 bg-[#252526] flex flex-col overflow-hidden flex-shrink-0 p-4"
          style={{ width: '50%' }}
        >
          <div className="flex-grow overflow-y-auto pr-2">
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{currentIndex + 1}. {problem.title}</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
              {problem.description}
            </pre>
          </div>
        </div>

        {/* Splitter */}
        <div
          className="w-2 h-full flex-shrink-0 rounded-lg cursor-col-resize flex items-center justify-center group bg-neutral-800 hover:bg-blue-600 active:bg-blue-700 transition-colors duration-150"
          onMouseDown={handleMouseDown}
        >
          <div className="w-1 h-8 bg-neutral-600 rounded-full group-hover:bg-white transition-colors"></div>
        </div>

        {/* Right Panel: Answer Area */}
        <div className="h-full rounded-lg border border-neutral-700 bg-[#252526] flex flex-col overflow-hidden flex-1">
          <div className="p-6 flex flex-col flex-grow h-full">
            <div className="flex-grow overflow-y-auto pr-2">
              <h3 className="text-xl font-semibold mb-4 text-gray-100">Your Answer</h3>
              {isMCQ ? (
                <div className="space-y-3">
                  {problem.options?.map((opt, idx) => (
                    <label key={idx} className={`block cursor-pointer p-3 rounded-lg border-2 transition-all ${selectedOption === opt ? 'border-yellow-500 bg-[#333]' : 'border-transparent bg-[#1e1e1e] hover:border-neutral-600'}`}>
                      <input type="radio" name="mcq" value={opt} checked={selectedOption === opt} onChange={() => setSelectedOption(opt)} className="mr-3 accent-yellow-500" />
                      <span className="text-gray-200">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  placeholder="Enter your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full h-full min-h-[200px] p-3 bg-[#1e1e1e] border border-neutral-600 rounded-lg text-sm resize-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none leading-relaxed"
                />
              )}
            </div>

            {/* Buttons at the bottom */}
            <div className="flex justify-between items-center mt-6 shrink-0">
              <button
                onClick={() => handleNavigateToProblem(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⬅️ Back
              </button>

              {/* UPDATED: End Contest button now has loading state and calls the new function */}
              <button
                onClick={() => handleFinalSubmit(false)}
                disabled={isEnding}
                className="bg-red-600 px-5 py-2 rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEnding ? 'Ending...' : 'End Contest 🚨'}
              </button>

              {currentIndex === problems.length - 1 ? (
                <button
                  onClick={handleSubmitAndNext}
                  className="bg-green-600 px-6 py-2 rounded-md font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  Submit ✅
                </button>
              ) : (
                <button
                  onClick={handleSubmitAndNext}
                  className="bg-green-600 px-6 py-2 rounded-md font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  Submit & Next ➡️
                </button>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContestProblemDetailPage;