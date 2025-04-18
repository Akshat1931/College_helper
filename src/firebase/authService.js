// src/firebase/authService.js
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc} from 'firebase/firestore';
import { auth, db } from './config';

// Collection name for users
const USERS_COLLECTION = 'users';

// Initial owner emails - these will always be admins
// In a production app, this would ideally be stored in environment variables
const OWNER_EMAILS = [
  'discordakshat04@gmail.com', 
  'akshatvaidik@gmail.com',
];

// Sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    // The signed-in user info
    const user = result.user;
    
    // Check if this is an existing user in our database
    await checkUserProfile(user);
    
    return {
      user,
      token,
      error: null
    };
  } catch (error) {
    return {
      user: null,
      token: null,
      error
    };
  }
};

// Check if user exists in database, if not create a new profile
const checkUserProfile = async (user) => {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // New user - create a basic profile
    const newUserData = {
      id: user.uid,
      name: user.displayName || 'New User',
      email: user.email,
      picture: user.photoURL,
      isNewUser: true,
      createdAt: new Date(),
      // Set initial admin status based on owner emails
      isAdmin: OWNER_EMAILS.includes(user.email),
      isOwner: OWNER_EMAILS.includes(user.email)
    };
    
    // Create the user document in Firestore
    await setDoc(userRef, newUserData);
    return { ...newUserData, needsProfileCompletion: true };
  }
  
  // Existing user - get current data
  const userData = userSnap.data();
  
  // Ensure owners always have admin privileges
  if (OWNER_EMAILS.includes(user.email) && !userData.isAdmin) {
    await updateDoc(userRef, {
      isAdmin: true,
      isOwner: true
    });
    
    // Update the data to reflect the changes
    userData.isAdmin = true;
    userData.isOwner = true;
  }
  
  // User exists, return their profile data
  return { ...userData, needsProfileCompletion: userData.isNewUser || false };
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  
  try {
    // Update the profile data with isNewUser set to false
    await setDoc(userRef, {
      ...profileData,
      isNewUser: false,
      updatedAt: new Date()
    }, { merge: true });
    
    // Get the updated user profile
    const updatedSnap = await getDoc(userRef);
    return updatedSnap.data();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Sign out
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Check if a user is an admin based on Firestore data
export const checkAdminStatus = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.isAdmin === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Listen to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      const userRef = doc(db, USERS_COLLECTION, user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Get the data from Firebase
        const userData = userSnap.data();

        // Ensure owner emails always have admin rights
        if (OWNER_EMAILS.includes(user.email) && !userData.isAdmin) {
          await updateDoc(userRef, {
            isAdmin: true
          });
          userData.isAdmin = true;
        }
      

        callback({
          userProfile: userData,
          isLoggedIn: true,
          needsProfileCompletion: userData.isNewUser || false,
          isAdmin: userData.isAdmin || false,
          isOwner: OWNER_EMAILS.includes(user.email)
        });
      
      } else {
        // This should rarely happen as we create the profile on sign in
        const newProfile = await checkUserProfile(user);
        callback({
          userProfile: newProfile,
          isLoggedIn: true,
          needsProfileCompletion: true,
          isAdmin: newProfile.isAdmin || false,
          isOwner: OWNER_EMAILS.includes(user.email)
        });
      }
    } else {
      // User is signed out
      callback({
        userProfile: null,
        isLoggedIn: false,
        needsProfileCompletion: false,
        isAdmin: false,
        isOwner: false
      });
    }
  });
};