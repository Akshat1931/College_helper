// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { useUser } from '../context/UserContext';
import CustomGoogleButton from './CustomGoogleButton';
import LoginOverlay from './LoginOverlay';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const { userProfile, isLoggedIn, isAdmin, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track previous login state to detect changes
  const [wasLoggedIn, setWasLoggedIn] = useState(isLoggedIn);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      
      // Auto-close mobile menu when switching to desktop
      if (!mobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    // Set initial states
    handleResize();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);
  
  // Effect to detect login state changes
  useEffect(() => {
    // If user wasn't logged in before and now is logged in
    if (!wasLoggedIn && isLoggedIn) {
      // Close the overlay if it's open
      if (showLoginOverlay) {
        setShowLoginOverlay(false);
        
        // If the user was trying to access the submit page, redirect there
        if (location.pathname !== '/submit') {
          navigate('/submit');
        }
      }
    }
    
    // Update previous login state
    setWasLoggedIn(isLoggedIn);
  }, [isLoggedIn, wasLoggedIn, showLoginOverlay, navigate, location.pathname]);

  const handleLogout = () => {
    logout(); // Use the context logout function
    navigate('/'); // Redirect to home on logout
    
    // Close mobile menu on logout if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to handle logo click
  function handleLogoClick() {
    navigate('/');
    // Scroll to top if already on the home page
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Close mobile menu when clicking logo
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  // Function to handle avatar click - always redirect to profiles
  function handleAvatarClick() {
    navigate('/complete-profile');
    
    // Close mobile menu when clicking avatar
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }
  
  // Function to handle home link click
  function handleHomeClick(e) {
    // If we're already on the home page, prevent default navigation and just scroll to top
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Close mobile menu when clicking nav link
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }
  
  // Function to handle any nav link click
  function handleNavLinkClick() {
    // Close mobile menu when clicking any nav link
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  // Function to handle submit resources click for non-logged-in users
  function handleSubmitClick(e) {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginOverlay(true);
      return false;
    } else {
      navigate('/submit');
    }
  }

  // Function to close the login overlay
  const closeLoginOverlay = () => {
    setShowLoginOverlay(false);
  };

  // Render the login overlay in a portal to avoid z-index issues
  const renderLoginOverlay = () => {
    if (!showLoginOverlay) return null;
    
    // Create a container for the overlay if it doesn't exist
    let overlayContainer = document.getElementById('login-overlay-container');
    if (!overlayContainer) {
      overlayContainer = document.createElement('div');
      overlayContainer.id = 'login-overlay-container';
      document.body.appendChild(overlayContainer);
    }
    
    return ReactDOM.createPortal(
      <LoginOverlay onClose={closeLoginOverlay} />,
      overlayContainer
    );
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <div className="logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
            <div className="logo-icon">CH</div>
            <span>College Helper</span>
          </div>
          
          {!isLoggedIn ? (
            <div className="auth-buttons">
              {/* Submit Resources link for non-logged in users */}
              <button 
                className="submit-link"
                onClick={handleSubmitClick}
              >
                Submit Resources
              </button>
              <CustomGoogleButton isMobile={isMobile} />
            </div>
          ) : (
            <div className="user-profile">
              <img 
                src={userProfile?.picture} 
                alt="User Profile" 
                className="user-avatar"
                onClick={handleAvatarClick}
                style={{cursor: 'pointer'}}
              />
              {/* Only show the username on desktop */}
              {!isMobile && <span>{userProfile?.name}</span>}
              
              {/* Submit resources link */}
              <Link 
                to="/submit" 
                className="submit-link"
                onClick={handleNavLinkClick}
              >
                Submit Resources
              </Link>
              
              {/* Add admin link if user is admin */}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="admin-link"
                  onClick={handleNavLinkClick}
                >
                  Admin Portal
                </Link>
              )}
              
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
          
          {/* Only show hamburger icon on mobile */}
          {isMobile && (
            <div 
              className={`mobile-menu-icon ${mobileMenuOpen ? 'active' : ''}`} 
              onClick={toggleMobileMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          
          <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
            <Link to="/" className="nav-link active" onClick={handleHomeClick}>Home</Link>
            <Link to="/#features" className="nav-link" onClick={handleNavLinkClick}>Features</Link>
            <Link to="/#semesters" className="nav-link" onClick={handleNavLinkClick}>Semesters</Link>
            <Link to="/about" className="nav-link" onClick={handleNavLinkClick}>About</Link>
            <Link to="#" className="nav-link" onClick={handleNavLinkClick}>Contact</Link>
            {/* Add Submit Resources in mobile menu */}
            {isMobile && (
              <a href="#" className="nav-link" onClick={isLoggedIn ? () => navigate('/submit') : handleSubmitClick}>
                Submit Resources
              </a>
            )}
            {/* Add admin link in mobile menu if user is admin */}
            {isAdmin && isMobile && (
              <Link to="/admin" className="nav-link" onClick={handleNavLinkClick}>Admin Portal</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Render login overlay */}
      {renderLoginOverlay()}
    </>
  );
}

export default Navbar;