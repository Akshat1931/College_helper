
import React from 'react';
import './MobileLoginButton.css';

// This component provides a fallback button for mobile devices
// if the Google login button doesn't render properly
function MobileLoginButton({ onClick }) {
  return (
    <button 
      className="mobile-login-button"
      onClick={onClick}
      aria-label="Sign in with Google"
    >
      <div className="google-icon"></div>
      <span>Sign in</span>
    </button>
  );
}

export default MobileLoginButton;