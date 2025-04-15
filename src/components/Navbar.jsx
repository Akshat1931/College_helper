// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext';
import MobileLoginButton from './MobileLoginButton';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [googleButtonFailed, setGoogleButtonFailed] = useState(false);
  const { userProfile, isLoggedIn, login, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const googleButtonRef = useRef(null);
  
  const CLIENT_ID = '355129341695-apk3c173ankp6207sq0idbmguhklorjq.apps.googleusercontent.com';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Check if Google button is properly loaded
    const checkGoogleButton = setTimeout(() => {
      const isMobile = window.innerWidth < 768;
      const googleButton = document.querySelector('.auth-buttons iframe');
      
      if (isMobile && (!googleButton || googleButton.clientHeight === 0)) {
        console.log('Google button failed to load properly on mobile');
        setGoogleButtonFailed(true);
      }
    }, 2000); // Check after 2 seconds
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(checkGoogleButton);
    };
  }, []);

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
      // Don't redirect automatically - let the user decide when to complete their profile
    }
  };

  const onGoogleLoginFailure = () => {
    console.log('Login Failed');
    setGoogleButtonFailed(true);
  };

  // Handle manual login for mobile fallback button
  const handleManualLogin = () => {
    // Prompt a new sign-in flow
    const googleLoginContainer = document.querySelector('.auth-buttons > div');
    if (googleLoginContainer) {
      const googleButton = googleLoginContainer.querySelector('[role="button"]');
      if (googleButton) {
        googleButton.click();
      } else {
        console.error('Could not find Google login button to click');
        // Implement a fallback login method if needed
      }
    }
  };

  const handleLogout = () => {
    logout(); // Use the context logout function
    navigate('/'); // Redirect to home on logout
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
  }

  // Function to handle avatar click - always redirect to profile
  function handleAvatarClick() {
    navigate('/complete-profile');
  }
  
  // Function to handle home link click
  function handleHomeClick(e) {
    // If we're already on the home page, prevent default navigation and just scroll to top
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <div className="logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
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
            <Link to="/" className="nav-link active" onClick={handleHomeClick}>Home</Link>
            <Link to="/#semesters" className="nav-link">Semesters</Link>
            <Link to="/#features" className="nav-link">Features</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="#" className="nav-link">Contact</Link>
          </nav>
          
          <div className="auth-buttons">
            {!isLoggedIn ? (
              <>
                <div ref={googleButtonRef}>
                  <GoogleLogin
                    onSuccess={onGoogleLoginSuccess}
                    onError={onGoogleLoginFailure}
                    useOneTap={false} // Disable one tap for better mobile compatibility
                  />
                </div>
                {googleButtonFailed && (
                  <MobileLoginButton onClick={handleManualLogin} />
                )}
              </>
            ) : (
              <div className="user-profile">
                <img 
                  src={userProfile?.picture} 
                  alt="User Profile" 
                  className="user-avatar"
                  onClick={handleAvatarClick}
                  style={{cursor: 'pointer'}}
                />
                <span>{userProfile?.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
    </GoogleOAuthProvider>
  );
}

export default Navbar;