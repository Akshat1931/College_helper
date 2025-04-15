// src/components/CustomGoogleButton.jsx
import React, { useEffect } from 'react';
import './CustomGoogleButton.css';

const CustomGoogleButton = ({ onSuccess, onError, isMobile = false }) => {
  useEffect(() => {
    // Load the Google Identity Services script
    const loadGoogleScript = () => {
      // Check if the script is already loaded
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        initializeGoogleLogin();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = initializeGoogleLogin;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    // Initialize Google Sign-In
    const initializeGoogleLogin = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: '355129341695-apk3c173ankp6207sq0idbmguhklorjq.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          prompt_parent_id: 'custom-google-signin-container',
          itp_support: false, // Disable "intelligent tracking prevention"
        });
      } else {
        console.error('Google Identity Services not loaded');
      }
    };

    // Handle the Google sign-in response
    const handleCredentialResponse = (response) => {
      if (response && response.credential) {
        onSuccess(response);
      } else {
        onError('No credential returned');
      }
    };

    loadGoogleScript();

    // Clean up
    return () => {
      // Cancel any pending sign-in prompts
      if (window.google && window.google.accounts) {
        window.google.accounts.id.cancel();
      }
    };
  }, [onSuccess, onError]);

  // Custom handler for button click
  const handleSignInClick = () => {
    if (window.google && window.google.accounts) {
      // Use renderButton with a custom container
      window.google.accounts.id.renderButton(
        document.getElementById('custom-google-signin-container'),
        {
          type: 'standard',
          theme: 'outline',
          size: isMobile ? 'medium' : 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'center',
          width: isMobile ? 200 : 240,
        }
      );
      
      // Immediately trigger the click on the rendered button
      setTimeout(() => {
        const googleButton = document.querySelector('#custom-google-signin-container div[role="button"]');
        if (googleButton) {
          googleButton.click();
        } else {
          // Fallback to prompt method
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log('Google sign-in prompt not displayed:', notification);
            }
          });
        }
      }, 100);
    }
  };

  return (
    <div className={`custom-google-button-wrapper ${isMobile ? 'mobile' : ''}`}>
      {/* Hidden container for Google to render its button */}
      <div id="custom-google-signin-container" style={{ display: 'none' }}></div>
      
      {/* Our custom button that will trigger Google's sign-in */}
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