// src/context/UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for user data
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
      setIsLoggedIn(true);
    }
  }, []);

  // Function to check if a user exists in our saved profiles
  const checkExistingUser = (googleId) => {
    const savedProfiles = localStorage.getItem('savedUserProfiles');
    if (!savedProfiles) return null;
    
    const profiles = JSON.parse(savedProfiles);
    return profiles[googleId] || null;
  };

  // Function to update user profile data
  const updateUserProfile = (newProfileData) => {
    if (!userProfile) return;
    
    const updatedProfile = { ...userProfile, ...newProfileData, isNewUser: false };
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Also save to our "database" of saved profiles
    const existingUserData = localStorage.getItem('savedUserProfiles');
    const savedProfiles = existingUserData ? JSON.parse(existingUserData) : {};
    
    // Store under the user's Google ID
    savedProfiles[userProfile.id] = updatedProfile;
    localStorage.setItem('savedUserProfiles', JSON.stringify(savedProfiles));
    console.log('Profile saved to persistent storage', updatedProfile);
  };

  // Function to handle login
  const login = (userData) => {
    // Check if this user has already created a profile before
    const existingUser = checkExistingUser(userData.id);
    
    if (existingUser) {
      console.log('Found existing user profile', existingUser);
      // Use the existing profile data but update with fresh data from Google
      const updatedUser = {
        ...existingUser,
        picture: userData.picture || existingUser.picture,
        email: userData.email || existingUser.email
      };
      setUserProfile(updatedUser);
      localStorage.setItem('userProfile', JSON.stringify(updatedUser));
      // Since we found an existing user, they don't need to complete profile again
      localStorage.removeItem('needsProfile');
    } else {
      console.log('Creating new user profile', userData);
      // This is a new user, save their initial data
      setUserProfile(userData);
      localStorage.setItem('userProfile', JSON.stringify(userData));
      // Mark that they need to complete their profile
      localStorage.setItem('needsProfile', 'true');
    }
    
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const logout = () => {
    setUserProfile(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('needsProfile');
  };

  const contextValue = {
    userProfile,
    isLoggedIn,
    updateUserProfile,
    login,
    logout
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}