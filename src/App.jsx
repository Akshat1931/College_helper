// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SemesterPage from './components/SemesterPage';
import SubjectPage from './components/SubjectPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import './App.css';

function ScrollToTop({ children }) {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use 'auto' for instant scroll
    });
  }, [location.pathname]);

  return children;
}

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/semester/:semId" element={<SemesterPage />} />
            <Route path="/semester/:semId/subject/:subjectId" element={<SubjectPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;