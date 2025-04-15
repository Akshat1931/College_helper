// src/components/ProfileNotification.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './ProfileNotification.css';

function ProfileNotification() {
  const { isLoggedIn, needsProfileCompletion } = useUser();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Show notification after a delay if user needs to complete profile
    if (isLoggedIn && needsProfileCompletion) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500); // Show after 1.5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, needsProfileCompletion]);
  
  if (!visible) return null;
  
  return (
    <div className="profile-notification">
      <div className="notification-content">
        <div className="notification-icon">👋</div>
        <div className="notification-text">
          <p>Welcome! Complete your profile to personalize your experience.</p>
        </div>
        <div className="notification-actions">
          <Link to="/complete-profile" className="complete-profile-btn">Complete Now</Link>
          <button className="dismiss-btn" onClick={() => setVisible(false)}>Later</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileNotification;