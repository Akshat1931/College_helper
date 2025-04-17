// src/firebase/authService.js
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
  import { auth, db } from './config';
  
  // Collection name for users
  const USERS_COLLECTION = 'users';
  
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
 // From src/firebase/authService.js
 const OWNER_EMAILS = [
  'discordakshat04@gmail.com', 
  'akshatvaidik@gmail.com',
  
];

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
      // Check if the user is an owner or admin
      isOwner: OWNER_EMAILS.includes(user.email),
      isAdmin: OWNER_EMAILS.includes(user.email)
    };
    
    // Create the user document in Firestore
    await setDoc(userRef, newUserData);
    return { ...newUserData, needsProfileCompletion: true };
  }
  
  // Existing user - ensure owner/admin status is correct
  const userData = userSnap.data();
  const shouldBeOwner = OWNER_EMAILS.includes(user.email);
  
  // Update owner and admin status if needed
  if (shouldBeOwner !== userData.isOwner || shouldBeOwner !== userData.isAdmin) {
    await updateDoc(userRef, {
      isOwner: shouldBeOwner,
      isAdmin: shouldBeOwner
    });
    
    // Merge updated status
    userData.isOwner = shouldBeOwner;
    userData.isAdmin = shouldBeOwner;
  }
  
  // User exists, return their profile data
  return { ...userData, needsProfileCompletion: false };
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
  
          // Verify and update owner/admin status
          const shouldBeOwner = OWNER_EMAILS.includes(user.email);
  
          if (shouldBeOwner !== userData.isOwner || shouldBeOwner !== userData.isAdmin) {
            await updateDoc(userRef, {
              isOwner: shouldBeOwner,
              isAdmin: shouldBeOwner
            });
            userData.isOwner = shouldBeOwner;
            userData.isAdmin = shouldBeOwner;
          }
  
          callback({
            userProfile: userData,
            isLoggedIn: true,
            needsProfileCompletion: userData.isNewUser || false,
            isAdmin: userData.isAdmin || false,
            isOwner: userData.isOwner || false
          });
        } else {
          // This should rarely happen as we create the profile on sign in
          const newProfile = await checkUserProfile(user);
          callback({
            userProfile: newProfile,
            isLoggedIn: true,
            needsProfileCompletion: true,
            isAdmin: newProfile.isAdmin || false,
            isOwner: newProfile.isOwner || false
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
  