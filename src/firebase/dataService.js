// src/firebase/dataService.js
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from './config';
  import { getHardCodedSubjects } from '../data/hardCodedSubjects';
  
  // Collection names
  const SUBJECTS_COLLECTION = 'subjects';
  const SEMESTERS_COLLECTION = 'semesters';
  
  // Initialize default semesters if not exists
  export const initializeSemesters = async () => {
    const semestersRef = collection(db, SEMESTERS_COLLECTION);
    const snapshot = await getDocs(semestersRef);
    
    if (snapshot.empty) {
      console.log('No semesters found, initializing defaults');
      const defaultSemesters = [];
      
      for (let i = 1; i <= 8; i++) {
        const semesterData = {
          id: i,
          name: `Semester ${i}`,
          description: i === 1 
            ? 'Your first step into higher education. This semester builds the foundation for your entire degree with core subjects that introduce fundamental concepts.'
            : i === 2
              ? 'Continue building on your foundation with more specialized knowledge and advanced concepts across core disciplines.'
              : i === 3
                ? 'Dive deeper into your field with more specialized courses that prepare you for upper-division study.'
                : i === 4
                  ? 'Begin to focus on application of knowledge and prepare for practical challenges in your field.'
                  : i === 5
                    ? 'Start your specialization with targeted courses that align with your career interests.'
                    : i === 6
                      ? 'Apply your knowledge to complex problems and scenarios relevant to industry needs.'
                      : i === 7
                        ? 'Focus on research methodologies and innovative approaches in your field.'
                        : 'Complete your capstone project and prepare for transitioning into the workforce.',
          image: `https://images.unsplash.com/photo-${1500000000 + i * 100000}?q=80&w=1000`,
          createdAt: serverTimestamp()
        };
        
        // Create the semester document
        await setDoc(doc(db, SEMESTERS_COLLECTION, i.toString()), semesterData);
        defaultSemesters.push(semesterData);
      }
      
      return defaultSemesters;
    }
    
    // Return existing semesters
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: parseInt(doc.id)
    }));
  };
  
  // Get all subjects
  export const getAllSubjects = async () => {
    try {
      const subjectsRef = collection(db, SUBJECTS_COLLECTION);
      const snapshot = await getDocs(subjectsRef);
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
    } catch (error) {
      console.error("Error getting all subjects:", error);
      return [];
    }
  };
  
  
  // Get subjects for a specific semester
  export const getSubjectsBySemester = async (semesterId) => {
    try {
      // Get subjects from Firebase
      const subjectsRef = collection(db, SUBJECTS_COLLECTION);
      const q = query(subjectsRef, where("semesterId", "==", parseInt(semesterId)));
      const snapshot = await getDocs(q);
      
      // Convert to array
      const firebaseSubjects = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      
      // Get hard-coded subjects for this semester
      const hardCodedSubjects = getHardCodedSubjects(parseInt(semesterId));
      
      // If we have Firebase subjects, merge them with hard-coded ones
      if (firebaseSubjects.length > 0) {
        // Use subject code as the unique identifier to prevent duplicates
        const firebaseSubjectCodes = firebaseSubjects.map(subject => subject.code);
        
        // Filter out hard-coded subjects that have a Firebase version
        const uniqueHardCodedSubjects = hardCodedSubjects.filter(
          subject => !firebaseSubjectCodes.includes(subject.code)
        );
        
        // Important change: Put hard-coded subjects first, then Firebase subjects
        return [...uniqueHardCodedSubjects, ...firebaseSubjects];
      }
      
      // If no Firebase subjects, return all hard-coded ones
      return hardCodedSubjects;
    } catch (error) {
      console.error(`Error getting subjects for semester ${semesterId}:`, error);
      // Fall back to hard-coded subjects on error
      return getHardCodedSubjects(parseInt(semesterId));
    }
  };
  // Add this to your dataService.js or create a new admin function
export const setUserAsAdmin = async (email) => {
  try {
    // Query to find the user with this email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error(`No user found with email: ${email}`);
      return false;
    }
    
    // Update the first matching user (should be only one)
    const userDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, 'users', userDoc.id), {
      isAdmin: true,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error setting admin status:", error);
    return false;
  }
};
  
  // Get a specific subject by ID
  export const getSubjectById = async (subjectId) => {
    try {
      const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
      const snapshot = await getDoc(subjectRef);
      
      if (snapshot.exists()) {
        return {
          ...snapshot.data(),
          id: snapshot.id
        };
      } else {
        console.log(`Subject with ID ${subjectId} not found`);
        return null;
      }
    } catch (error) {
      console.error(`Error getting subject ${subjectId}:`, error);
      return null;
    }
  };
  export const getAllAdmins = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("isAdmin", "==", true));
      const snapshot = await getDocs(q);
      
      const adminList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      console.log("Raw Admin List from Firestore:", adminList); // Debug log
      
      return adminList;
    } catch (error) {
      console.error("Error fetching admin users:", error);
      return [];
    }
  };
  
  // Remove admin status from a user
  export const removeAdminStatus = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isAdmin: false,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error removing admin status:", error);
      return false;
    }
  };
  
  // Add a new admin by email
  export const addAdminByEmail = async (email) => {
    try {
      // First, find the user with this email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // No user found with this email
        return {
          success: false,
          message: "No user found with this email."
        };
      }
      
      // Get the first matching user
      const userDoc = querySnapshot.docs[0];
      
      // Check if user is already an admin
      if (userDoc.data().isAdmin) {
        return {
          success: false,
          message: "User is already an admin."
        };
      }
      
      // Update user to be an admin
      await updateDoc(doc(db, 'users', userDoc.id), {
        isAdmin: true,
        updatedAt: serverTimestamp()
      });
      
      return {
        success: true,
        message: "Admin status granted successfully.",
        user: {
          id: userDoc.id,
          ...userDoc.data()
        }
      };
    } catch (error) {
      console.error("Error adding admin:", error);
      return {
        success: false,
        message: "Failed to add admin. Please try again."
      };
    }
  };
  
  // Add a new subject
  export const addSubject = async (subjectData) => {
    try {
      // Create a new document with auto-generated ID
      const newSubjectRef = doc(collection(db, SUBJECTS_COLLECTION));
      
      const subjectWithMetadata = {
        ...subjectData,
        chapters: [],
        previousYearQuestions: [],
        assignments: [],
        videoLectures: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(newSubjectRef, subjectWithMetadata);
      
      return {
        ...subjectWithMetadata,
        id: newSubjectRef.id
      };
    } catch (error) {
      console.error("Error adding subject:", error);
      throw error;
    }
  };
  
  // Update existing subject
  export const updateSubject = async (subjectId, updatedData) => {
    try {
      const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
      
      // Add updated timestamp
      const dataWithTimestamp = {
        ...updatedData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(subjectRef, dataWithTimestamp);
      
      // Get the updated document
      const updatedDoc = await getDoc(subjectRef);
      
      return {
        ...updatedDoc.data(),
        id: updatedDoc.id
      };
    } catch (error) {
      console.error(`Error updating subject ${subjectId}:`, error);
      throw error;
    }
  };
  
  // Delete subject
  export const deleteSubject = async (subjectId) => {
    try {
      const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
      await deleteDoc(subjectRef);
      return true;
    } catch (error) {
      console.error(`Error deleting subject ${subjectId}:`, error);
      throw error;
    }
  };
  
  // Add chapter to subject
  // Add chapter to subject
export const addChapter = async (subjectId, chapterData) => {
    try {
      const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
      const subjectDoc = await getDoc(subjectRef);
  
      if (!subjectDoc.exists()) {
        throw new Error(`Subject with ID ${subjectId} not found`);
      }
  
      // Ensure chapters array exists
      const subject = subjectDoc.data();
      const chapters = subject.chapters || [];
  
      // Prepare new chapter - REMOVE serverTimestamp() from individual chapter
      const newChapter = {
        ...chapterData,
        id: new Date().getTime().toString() // Removed createdAt: serverTimestamp()
      };
  
      // Update document, ensuring all fields exist
      await updateDoc(subjectRef, {
        chapters: [...chapters, newChapter],
        updatedAt: serverTimestamp()  // Keep this at the document level
      });
  
      // Fetch updated document
      const updatedDoc = await getDoc(subjectRef);
      return {
        ...updatedDoc.data(),
        id: updatedDoc.id
      };
    } catch (error) {
      console.error('Detailed Chapter Addition Error:', {
        subjectId,
        chapterData,
        errorMessage: error.message,
        errorStack: error.stack
      });
      throw error;
    }
  };
  
  // Add video lecture to subject
  // Add video lecture to subject
export const addVideoLecture = async (subjectId, videoData) => {
    try {
      const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
      const subjectDoc = await getDoc(subjectRef);
  
      if (!subjectDoc.exists()) {
        throw new Error(`Subject with ID ${subjectId} not found`);
      }
  
      // Generate unique ID for the video
      const videoId = new Date().getTime().toString();
  
      // Remove serverTimestamp from individual video
      const newVideo = {
        ...videoData,
        id: videoId
        // Removed createdAt: serverTimestamp()
      };
  
      // Get current video lectures array or empty array if it doesn't exist
      const subject = subjectDoc.data();
      const videos = subject.videoLectures || [];
  
      // Update the subject with the new video
      await updateDoc(subjectRef, {
        videoLectures: [...videos, newVideo], // Add the new video to the array
        updatedAt: serverTimestamp()  // Keep this at the document level
      });
  
      // Get the updated subject
      const updatedDoc = await getDoc(subjectRef);
      return {
        ...updatedDoc.data(),
        id: updatedDoc.id
      };
    } catch (error) {
      console.error(`Error adding video to subject ${subjectId}:`, error);
      throw error;
    }
  };
  
  
  // Add previous year question to subject
  // Add previous year question to subject
export const addPreviousYearQuestion = async (subjectId, pyqData) => {
    try {
      const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
      const subjectDoc = await getDoc(subjectRef);
  
      if (!subjectDoc.exists()) {
        throw new Error(`Subject with ID ${subjectId} not found`);
      }
  
      // Generate unique ID for the PYQ
      const pyqId = new Date().getTime().toString();
  
      // Remove serverTimestamp from individual PYQ
      const newPYQ = {
        ...pyqData,
        id: pyqId
        // Removed createdAt: serverTimestamp()
      };
  
      // Get current PYQs array or empty array if it doesn't exist
      const subject = subjectDoc.data();
      const pyqs = subject.previousYearQuestions || [];
  
      // Update the subject with the new PYQ
      await updateDoc(subjectRef, {
        previousYearQuestions: [...pyqs, newPYQ], // Add the new PYQ to the array
        updatedAt: serverTimestamp()  // Keep this at the document level
      });
  
      // Get the updated subject
      const updatedDoc = await getDoc(subjectRef);
      return {
        ...updatedDoc.data(),
        id: updatedDoc.id
      };
    } catch (error) {
      console.error(`Error adding PYQ to subject ${subjectId}:`, error);
      throw error;
    }
  };
  
  // Add assignment to subject
  // Add assignment to subject
export const addAssignment = async (subjectId, assignmentData) => {
    try {
      const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
      const subjectDoc = await getDoc(subjectRef);
  
      if (!subjectDoc.exists()) {
        throw new Error(`Subject with ID ${subjectId} not found`);
      }
  
      // Generate unique ID for the assignment
      const assignmentId = new Date().getTime().toString();
  
      // Remove serverTimestamp from individual assignment
      const newAssignment = {
        ...assignmentData,
        id: assignmentId
        // Removed createdAt: serverTimestamp()
      };
  
      // Get current assignments array or empty array if it doesn't exist
      const subject = subjectDoc.data();
      const assignments = subject.assignments || [];
  
      // Update the subject with the new assignment
      await updateDoc(subjectRef, {
        assignments: [...assignments, newAssignment], // Add the new assignment to the array
        updatedAt: serverTimestamp()  // Keep this at the document level
      });
  
      // Get the updated subject
      const updatedDoc = await getDoc(subjectRef);
      return {
        ...updatedDoc.data(),
        id: updatedDoc.id
      };
    } catch (error) {
      console.error(`Error adding assignment to subject ${subjectId}:`, error);
      throw error;
    }
  };
  
  // Get all semesters
  export const getAllSemesters = async () => {
    try {
      const semestersRef = collection(db, SEMESTERS_COLLECTION);
      const snapshot = await getDocs(semestersRef);
      
      if (snapshot.empty) {
        return await initializeSemesters();
      }
      
      // Convert to array and sort by ID
      return snapshot.docs
        .map(doc => ({
          ...doc.data(),
          id: parseInt(doc.id)
        }))
        .sort((a, b) => a.id - b.id);
    } catch (error) {
      console.error("Error getting all semesters:", error);
      return [];
    }
  };
  
  // Update semester info
  export const updateSemester = async (semesterId, updatedData) => {
    try {
      const semesterRef = doc(db, SEMESTERS_COLLECTION, semesterId.toString());
      
      // Add updated timestamp
      const dataWithTimestamp = {
        ...updatedData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(semesterRef, dataWithTimestamp);
      
      // Get the updated document
      const updatedDoc = await getDoc(semesterRef);
      
      return {
        ...updatedDoc.data(),
        id: parseInt(updatedDoc.id)
      };
    } catch (error) {
      console.error(`Error updating semester ${semesterId}:`, error);
      throw error;
    }
  };
  
  // Delete a resource (chapter, video, assignment, PYQ) from a subject
  export const deleteResourceFromSubject = async (subjectId, resourceType, resourceId) => {
    try {
      const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
      const subjectDoc = await getDoc(subjectRef);
      
      if (!subjectDoc.exists()) {
        throw new Error(`Subject with ID ${subjectId} not found`);
      }
      
      const subject = subjectDoc.data();
      
      // Check which resource type we're deleting
      let resourceArray;
      switch (resourceType) {
        case 'chapter':
          resourceArray = 'chapters';
          break;
        case 'video':
          resourceArray = 'videoLectures';
          break;
        case 'pyq':
          resourceArray = 'previousYearQuestions';
          break;
        case 'assignment':
          resourceArray = 'assignments';
          break;
        default:
          throw new Error(`Invalid resource type: ${resourceType}`);
      }
      
      // Verify the resource array exists
      if (!Array.isArray(subject[resourceArray])) {
        throw new Error(`Subject doesn't have any ${resourceArray}`);
      }
      
      // Filter out the resource to delete
      const updatedResources = subject[resourceArray].filter(
        resource => resource.id !== resourceId
      );
      
      // Update the subject with the filtered array
      await updateDoc(subjectRef, {
        [resourceArray]: updatedResources,
        updatedAt: serverTimestamp()
      });
      
      // Get the updated subject
      const updatedDoc = await getDoc(subjectRef);
      return {
        ...updatedDoc.data(),
        id: updatedDoc.id
      };
    } catch (error) {
      console.error(`Error deleting ${resourceType} from subject ${subjectId}:`, error);
      throw error;
    }
  };
  
  // Initialize with example data for testing
  export const initializeWithExampleData = async () => {
    // Check if we already have data
    const subjectsRef = collection(db, SUBJECTS_COLLECTION);
    const snapshot = await getDocs(subjectsRef);
    
    if (!snapshot.empty) {
      console.log("Data already exists, skipping initialization");
      return; // Don't override existing data
    }
    
    // Make sure semesters are initialized first
    await initializeSemesters();
    
    const exampleSubjects = [
      {
        id: '1001',
        name: 'Mathematics I',
        code: '18MAB101T',
        description: 'This course covers calculus, linear algebra, and analytical geometry. Students will learn fundamental mathematical concepts and problem-solving techniques.',
        instructor: 'Dr. Sarah Johnson',
        credits: 4,
        semesterId: 1,
        syllabusUrl: 'https://drive.google.com/file/d/1ZyuDGExbr648v6CJBlYt0ccdUA2G39TP/view?usp=sharing',
        chapters: [
          {
            id: '2001',
            title: 'Unit 1: Matrices',
            description: 'Eigen values, Eigen vectors, Cayley-Hamilton Theorem and Orthagonal reduction',
            driveEmbedUrl: 'https://drive.google.com/file/d/1XDCl-Yew0aNeGcAeLj97OLzVZ2z7r6Yo/view?usp=sharing',
            createdAt: serverTimestamp()
          }
        ],
        videoLectures: [
          {
            id: '3001',
            title: 'Unit 1 Lecture',
            description: 'Introduction to Matrices and eigenvalues',
            url: 'https://www.youtube.com/embed/FcOIWK5SGZg',
            iframe: '<iframe width="1057" height="634" src="https://www.youtube.com/embed/FcOIWK5SGZg" title="12. Finding nature from Quadratic form without Eigen values" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            createdAt: serverTimestamp()
          }
        ],
        previousYearQuestions: [],
        assignments: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];
    
    // Add example subjects
    for (const subject of exampleSubjects) {
      await setDoc(doc(db, SUBJECTS_COLLECTION, subject.id), subject);
    }
    
    console.log("Example data initialized successfully");
  };
  export const debugResourceAddition = async (subjectId, resourceType, resourceData) => {
    console.group('🔍 Resource Addition Diagnostics');
    console.log('Input Parameters:', { 
      subjectId, 
      resourceType, 
      resourceData 
    });
  
    try {
      // Validate critical inputs
      if (!subjectId) {
        console.error('❌ No Subject ID provided');
        throw new Error('Subject ID is required');
      }
  
      if (!resourceType) {
        console.error('❌ No Resource Type provided');
        throw new Error('Resource type is required');
      }
  
      if (!resourceData) {
        console.error('❌ No Resource Data provided');
        throw new Error('Resource data is required');
      }
  
      // Reference to the subject document
      const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
      
      // Fetch the current subject document
      const subjectDoc = await getDoc(subjectRef);
  
      // Check if subject exists
      if (!subjectDoc.exists()) {
        console.error(`❌ Subject with ID ${subjectId} not found`);
        throw new Error(`Subject with ID ${subjectId} not found`);
      }
  
      // Get current subject data
      const currentSubjectData = subjectDoc.data();
      console.log('Current Subject Data:', currentSubjectData);
  
      // Validate resource type and field
      const resourceTypeMap = {
        'chapter': 'chapters',
        'video': 'videoLectures',
        'assignment': 'assignments',
        'pyq': 'previousYearQuestions'
      };
  
      const updateField = resourceTypeMap[resourceType];
  
      if (!updateField) {
        console.error(`❌ Invalid Resource Type: ${resourceType}`);
        throw new Error(`Invalid resource type: ${resourceType}`);
      }
  
      // Log current resources
      const currentResources = currentSubjectData[updateField] || [];
      console.log(`Current ${updateField}:`, currentResources);
  
      console.groupEnd();
      
      // If you want to actually add the resource, you would uncomment and adapt:
      // return addResourceToSubject(subjectId, resourceType, resourceData);
  
    } catch (error) {
      console.error('❌ Resource Addition Diagnostic Error:', {
        message: error.message,
        stack: error.stack
      });
      console.groupEnd();
      throw error;
    }
  };
  
  // Export all methods
  export default {
    initializeSemesters,
    getAllSubjects,
    setUserAsAdmin,
    getSubjectsBySemester,
    getSubjectById,
    addSubject,
    updateSubject,
    deleteSubject,
    addChapter,
    addVideoLecture,
    addPreviousYearQuestion,
    addAssignment,
    getAllSemesters,
    updateSemester,
    getAllAdmins,
    removeAdminStatus,
    addAdminByEmail,
    deleteResourceFromSubject,
    initializeWithExampleData
  };