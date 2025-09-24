import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Problem from "./pages/Problem";
import ProblemDetail from './pages/ProblemDetail';
import Discuss from "./pages/Discuss";
import CreateDiscussion from "./pages/CreateDiscussion";
import ProfilePage from './pages/ProfilePage';
import Contribute from './pages/Contribute';
import ContestPage from './pages/ContestPage';
import ContestDetailPage from './pages/ContestDetailPage';
import ContestProblemListPage from './pages/ContestProblemListPage';
import ContestProblemDetail from './pages/ContestProblemDetailPage';
import ContestLeaderboard from './pages/ContestLeaderboard';
import ContestSolutionPage from './pages/ContestSolutionPage';

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import Problems from "./admin/Problems";
import Reports from "./admin/Reports";
import Contest from "./admin/Contest";
import CreateContest from "./admin/CreateContest";
import { API_BASE_URL } from './Constants';


function App() {

  return (
    <>
      <Routes>
      {/* 🌐 Public/User Routes */}
      <Route element={<UserLayout />}> 
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/problems" element={<Problem />} />
         <Route path="/problem/:id" element={<ProblemDetail />} />
         <Route path="/discuss" element={<Discuss />} />
         <Route path="/create-discussion" element={<CreateDiscussion />} />
         <Route path="/profile" element={<ProfilePage />} />
         <Route path="/contribute" element={<Contribute />} />
         <Route path="/contest" element={<ContestPage />} />
        <Route path="/contest/:contestId" element={<ContestDetailPage />} />
        <Route path="/contest/:contestId/problem-list" element={<ContestProblemListPage />} />
        <Route path="/contest/:contestId/solutions" element={<ContestProblemListPage />} />
        <Route path="/contest/:contestId/problem/:problemIndex" element={<ContestProblemDetail />} />
        <Route path="/contest/:contestId/solutions/:problemIndex" element={<ContestSolutionPage />} />
        <Route path="/contest/:contestId/leaderboard" element={<ContestLeaderboard />} />




        
      </Route>

      {/* 🔒 Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="problems" element={<Problems />} />
        <Route path="reports" element={<Reports />} />
        <Route path="contest" element={<Contest />} />
        
        <Route path="create-contest" element={<CreateContest />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
