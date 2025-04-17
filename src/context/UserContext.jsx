// src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithGoogle, 
  logoutUser, 
  updateUserProfile as updateFirebaseUserProfile,
  subscribeToAuthChanges 
} from '../firebase/authService';

// Create a context for user data
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  
  // Set up auth state listener on mount
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authState) => {
      setUserProfile(authState.userProfile);
      setIsLoggedIn(authState.isLoggedIn);
      setNeedsProfileCompletion(authState.needsProfileCompletion);
      setIsAdmin(authState.isAdmin);
      setLoading(false); // No longer loading once we have the initial state
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to update user profile data
  const updateUserProfile = async (newProfileData) => {
    if (!userProfile) return;
    
    try {
      // Update profile in Firebase
      const updatedProfile = await updateFirebaseUserProfile(
        userProfile.id,
        newProfileData
      );
      
      // Update local state
      setUserProfile(updatedProfile);
      setNeedsProfileCompletion(false);
      
      return updatedProfile;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  // Function to handle login with Google
  const login = async () => {
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        console.error("Login failed:", error);
        return { success: false, error };
      }
      
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error };
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await logoutUser();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error };
    }
  };

  const contextValue = {
    userProfile,
    isLoggedIn,
    needsProfileCompletion,
    isAdmin,
    loading,
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