// src/components/LoginOverlay.jsx
import React, { useEffect } from 'react';
import CustomGoogleButton from './CustomGoogleButton';
import './LoginOverlay.css';

const LoginOverlay = ({ onClose }) => {
  // Add body class to prevent background scrolling
  useEffect(() => {
    // Add class to prevent scrolling
    document.body.classList.add('overlay-open');
    
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('overlay-open');
    };
  }, []);

  return (
    <div className="login-overlay-container" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="login-overlay-backdrop"></div>
      <div className="login-overlay-modal">
        <button className="login-overlay-close" onClick={onClose}>×</button>
        <div className="login-overlay-content">
          <div className="login-overlay-icon">🔒</div>
          <h2>Login Required</h2>
          <p>Please sign in to submit resources and contribute to the community.</p>
          <div className="login-overlay-actions">
            <CustomGoogleButton isMobile={false} />
          </div>
          <p className="login-overlay-footer">
            By signing in, you agree to our <a href="/terms-of-service">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginOverlay;