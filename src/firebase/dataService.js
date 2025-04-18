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
    orderBy,
    where,
    Timestamp,
    serverTimestamp,
    writeBatch
  } from 'firebase/firestore';
  import { db } from './config';
  import { getHardCodedSubjects } from '../data/hardCodedSubjects';
  
  // Collection names
  const USERS_COLLECTION = 'users';

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
  // Add this function to your src/firebase/dataService.js file

/**
 * Updates the order of subjects within a semester
 * @param {number} semesterId - The semester ID 
 * @param {Array} orderedSubjects - Array of subjects in the new order
 * @returns {Promise} - Promise that resolves when the update is complete
 */
// Improved updateSubjectsOrder function for dataService.js
export const updateSubjectsOrder = async (semesterId, orderedSubjects) => {
  try {
    console.group('🔍 Subjects Order Update Diagnostics');
    console.log('Semester ID:', semesterId);
    console.log('Original Subjects:', orderedSubjects.map(s => ({
      id: s.id, 
      name: s.name, 
      currentOrder: s.displayOrder
    })));
    
    // Create a batch to update all subjects at once
    const batch = writeBatch(db);
    
    // First, collect valid subjects that need reordering
    const validSubjects = orderedSubjects.filter(
      subject => subject.id && !subject.id.startsWith('hardcoded_')
    );
    
    // If fewer than 2 subjects, no need to reorder
    if (validSubjects.length < 2) {
      console.log('Not enough subjects to reorder');
      console.groupEnd();
      return false;
    }
    
    // Sort subjects by their current displayOrder
    const sortedSubjects = [...validSubjects].sort((a, b) => 
      (a.displayOrder || 0) - (b.displayOrder || 0)
    );
    
    // Swap the display orders explicitly
    sortedSubjects.forEach((subject, index) => {
      const subjectRef = doc(db, SUBJECTS_COLLECTION, subject.id);
      
      console.log(`Updating subject: ${subject.name}, New Order: ${index}`);
      
      batch.update(subjectRef, { 
        displayOrder: index,
        updatedAt: serverTimestamp()
      });
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log('✅ Subjects order updated successfully');
    console.groupEnd();
    
    return true;
  } catch (error) {
    console.error('❌ Subjects Order Update Error:', {
      semesterId,
      errorMessage: error.message,
      errorStack: error.stack
    });
    console.groupEnd();
    
    throw error; // Re-throw to allow calling function to handle
  }
};

// Update your getSubjectsBySemester function to include ordering
// Improved getSubjectsBySemester function with better error handling and logging
// Improved getSubjectsBySemester function with hardcoded subjects first
export const getSubjectsBySemester = async (semesterId) => {
  try {
    console.group('🔍 Get Subjects by Semester Diagnostics');
    console.log('Requested Semester ID:', semesterId);
    
    // Ensure semesterId is a number
    const semesterIdNum = Number(semesterId);

    // Get hard-coded subjects for this semester FIRST
    const hardCodedSubjects = getHardCodedSubjects(semesterIdNum);
    
    // Add display order to hardcoded subjects to ensure they come FIRST
    // Use negative numbers to ensure they're always at the top
    const hardCodedSubjectsWithOrder = hardCodedSubjects.map((subject, index) => ({
      ...subject,
      displayOrder: -1000 + index // Use negative values to keep them at the top
    }));
    
    console.log('Hardcoded Subjects with Order:', hardCodedSubjectsWithOrder.map(s => ({
      id: s.id,
      name: s.name,
      displayOrder: s.displayOrder
    })));

    // Get subjects from Firebase SECOND (these will come after hardcoded ones)
    const subjectsRef = collection(db, SUBJECTS_COLLECTION);
    let q;
    
    try {
      // Query for subjects with matching semesterId
      q = query(
        subjectsRef,
        where("semesterId", "==", semesterIdNum),
        orderBy("displayOrder", "asc")
      );
    } catch (orderByError) {
      console.warn("Error using orderBy - falling back to basic query:", orderByError);
      // Fallback to basic query without ordering
      q = query(
        subjectsRef,
        where("semesterId", "==", semesterIdNum)
      );
    }
    
    const snapshot = await getDocs(q);
    
    // Convert to array and log detailed information
    const firebaseSubjects = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        displayOrder: Number(data.displayOrder || 0) + 1000 // Add 1000 to push them after hardcoded
      };
    });

    console.log('Firebase Subjects Raw (with adjusted order):', firebaseSubjects.map(s => ({
      id: s.id,
      name: s.name,
      semesterId: s.semesterId,
      displayOrder: s.displayOrder
    })));
    
    // Merge subjects - hardcoded first, then Firebase subjects
    const mergedSubjects = [
      ...hardCodedSubjectsWithOrder,
      ...firebaseSubjects.filter(fb => 
        !hardCodedSubjectsWithOrder.some(hc => 
          (fb.code && hc.code && fb.code === hc.code) || fb.id === hc.id
        )
      )
    ];

    // Sort by display order (should keep hardcoded at top due to negative values)
    const sortedSubjects = mergedSubjects.sort((a, b) => 
      (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0)
    );

    console.log('Final Merged and Sorted Subjects:', sortedSubjects.map(s => ({
      id: s.id,
      name: s.name,
      displayOrder: s.displayOrder
    })));

    console.groupEnd();
    
    return sortedSubjects;
  } catch (error) {
    console.error('❌ Error Getting Subjects by Semester:', {
      semesterId,
      errorMessage: error.message,
      errorStack: error.stack
    });
    console.groupEnd();
    
    // Fallback to hard-coded subjects if everything else fails
    return getHardCodedSubjects(Number(semesterId)).map((subject, index) => ({
      ...subject,
      displayOrder: -1000 + index // Keep them at the top even in fallback
    }));
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
      const usersRef = collection(db, USERS_COLLECTION);
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // No user found with this email
        return {
          success: false,
          message: "No user found with this email. The user must log in at least once before they can be made an admin."
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
      await updateDoc(doc(db, USERS_COLLECTION, userDoc.id), {
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
  // Update the addSubject function in dataService.js to ensure displayOrder is set
export const addSubject = async (subjectData) => {
  try {
    console.log("Adding new subject:", subjectData.name);
    
    // Get current count of subjects for this semester to determine order
    const subjectsRef = collection(db, SUBJECTS_COLLECTION);
    const q = query(subjectsRef, where("semesterId", "==", parseInt(subjectData.semesterId)));
    const snapshot = await getDocs(q);
    const currentCount = snapshot.docs.length;
    
    console.log(`Current subject count for semester ${subjectData.semesterId}: ${currentCount}`);

    // Create a new document with auto-generated ID
    const newSubjectRef = doc(collection(db, SUBJECTS_COLLECTION));
    
    // Make sure we have displayOrder in the data
    const subjectWithMetadata = {
      ...subjectData,
      displayOrder: currentCount, // This is important - makes sure new subjects appear at the end
      chapters: [],
      previousYearQuestions: [],
      assignments: [],
      videoLectures: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(newSubjectRef, subjectWithMetadata);
    console.log(`Subject ${subjectData.name} added with displayOrder ${currentCount}`);
    
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