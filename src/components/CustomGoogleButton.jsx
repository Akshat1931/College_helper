// src/components/CustomGoogleButton.jsx
import React from 'react';
import './CustomGoogleButton.css';
import { useUser } from '../context/UserContext';

const CustomGoogleButton = ({ isMobile = false }) => {
  const { login } = useUser(); // This should now use Firebase auth

  const handleSignInClick = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div className={`custom-google-button-wrapper ${isMobile ? 'mobile' : ''}`}>
      <button 
        className={`custom-google-button ${isMobile ? 'mobile' : ''}`}
        onClick={handleSignInClick}
        type="button"
        aria-label="Sign in with Google"
      >
        <div className="google-icon"></div>
        <span>{isMobile ? 'Sign in' : 'Sign in with Google'}</span>
      </button>
    </div>
  );
};

export default CustomGoogleButton;