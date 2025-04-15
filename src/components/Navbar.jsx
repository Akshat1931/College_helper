import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProfile, isLoggedIn, login, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const CLIENT_ID = '355129341695-apk3c173ankp6207sq0idbmguhklorjq.apps.googleusercontent.com';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    
    // Check if user should be redirected to complete profile
    if (localStorage.getItem('needsProfile') === 'true') {
      navigate('/complete-profile');
    }
  };

  const onGoogleLoginFailure = () => {
    console.log('Login Failed');
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
              <GoogleLogin
                onSuccess={onGoogleLoginSuccess}
                onError={onGoogleLoginFailure}
              />
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