// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleHomeClick = () => {
    // If on home page, scroll to top
    if (location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Navigate to home and scroll to top
      navigate('/');
      window.scrollTo(0, 0);
    }
  };

  const handleSectionScroll = (sectionId) => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
    }

    // Use setTimeout to ensure page is loaded before scrolling
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <div onClick={handleHomeClick} className="logo" style={{cursor: 'pointer'}}>
          <div className="logo-icon">CH</div>
          <span>College Helper</span>
        </div>
        
        <div 
          className={`mobile-menu-icon ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <div onClick={handleHomeClick} className="nav-link active">Home</div>
          <div 
            onClick={() => handleSectionScroll('semesters')} 
            className="nav-link"
          >
            Semesters
          </div>
          <div 
            onClick={() => handleSectionScroll('features')} 
            className="nav-link"
          >
            Features
          </div>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="#" className="nav-link">Contact</Link>
        </nav>
        
        <div className="auth-buttons">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;