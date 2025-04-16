// src/components/Navbar.jsx - Add admin link to navbar
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext';
import CustomGoogleButton from './CustomGoogleButton';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { userProfile, isLoggedIn, isAdmin, login, logout } = useUser(); // Add isAdmin
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const generateGuestName = () => {
    const adjectives = ['Clever', 'Bright', 'Sharp', 'Quick', 'Eager'];
    const nouns = ['Student', 'Learner', 'Scholar', 'Researcher', 'Innovator'];
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `Guest${randomAdjective}${randomNoun}${randomNumber}`;
  };

  const onGoogleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    
    // Create user data object from Google response
    const userData = {
      id: decoded.sub,  // Google's unique user ID - essential for profile persistence
      name: decoded.name || generateGuestName(),
      email: decoded.email,
      picture: decoded.picture || '/default-avatar.png',
      originalName: decoded.name
    };
    
    // The login function will check if this user exists already
    login(userData);
    
    // Add a notification for new users instead of automatic redirect
    if (localStorage.getItem('needsProfile') === 'true') {
      // You could show a toast notification here or handle this differently
      console.log('New user - profile completion recommended');
    }
  };

  const onGoogleLoginFailure = (error) => {
    console.log('Login Failed:', error);
  };

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

  // Function to handle avatar click - always redirect to profile
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

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <div className="logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
          <div className="logo-icon">CH</div>
          <span>College Helper</span>
        </div>
        
        {!isLoggedIn ? (
          <div className="auth-buttons">
            <CustomGoogleButton 
              onSuccess={onGoogleLoginSuccess}
              onError={onGoogleLoginFailure}
              isMobile={isMobile} // Pass isMobile state to the button
            />
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
          {/* Add admin link in mobile menu if user is admin */}
          {isAdmin && isMobile && (
            <Link to="/admin" className="nav-link" onClick={handleNavLinkClick}>Admin Portal</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;