// src/App.jsx - Add the ResourceSubmission route
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import { UserProvider } from './context/UserContext';
import SemesterPage from './components/SemesterPage';
import SubjectPage from './components/SubjectPage';
import CompleteProfilePage from './components/CompleteProfilePage';
import AdminPortal from './components/AdminPortal';
import ResourceSubmission from './components/ResourceSubmission'; // Import the new component
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import { Analytics } from "@vercel/analytics/react";
import './App.css';

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use 'auto' for instant scroll
    });
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <ScrollToTop />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/complete-profile" element={<CompleteProfilePage />} />
              <Route path="/semester/:semId" element={<SemesterPage />} />
              <Route path="/semester/:semId/subject/:subjectId" element={<SubjectPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/submit" element={<ResourceSubmission />} /> {/* New submission route */}
            </Routes>
          </div>
          <Footer />
        </div>
        <Analytics />
      </Router>
    </UserProvider>
  );
}

export default App;