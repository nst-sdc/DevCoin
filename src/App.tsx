import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CoinsPage from './pages/CoinsPage';
import MembersPage from './pages/MembersPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SignInForm from './components/auth/SignInForm';
import SignUpForm from './components/auth/SignUpForm';
import AdminPanel from './components/admin/AdminPanel';
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';
import BackgroundLayout from './components/common/BackgroundLayout';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <BackgroundLayout>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16 px-4 max-w-full mx-auto w-full">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectPage />} />
                <Route path="/coins" element={<CoinsPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/signin" element={<SignInForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        </BackgroundLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;