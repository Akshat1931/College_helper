// src/firebase/submissionService.js
import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    doc, 
    serverTimestamp, 
    query, 
    where,
    getDoc,
    deleteDoc
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './config';
  import { 
    addChapter, 
    addVideoLecture, 
    addPreviousYearQuestion, 
    addAssignment 
  } from './dataService';
  
  // Collection name for submissions
  const SUBMISSIONS_COLLECTION = 'resource_submissions';
  
  /**
   * Submit a new resource for admin approval
   * @param {Object} submissionData - The submission data
   * @returns {Promise<Object>} - The created submission with ID
   */
  export const submitResource = async (submissionData) => {
    try {
      // Upload file if present
      let fileURL = null;
      if (submissionData.file) {
        try {
          const fileRef = ref(storage, `submissions/${submissionData.userId}/${Date.now()}_${submissionData.file.name}`);
          await uploadBytes(fileRef, submissionData.file);
          fileURL = await getDownloadURL(fileRef);
        } catch (fileError) {
          console.error('File upload failed:', fileError);
          // Continue without file upload if it fails due to CORS
          fileURL = null;
        }
      }
  
      // Add submission to Firestore
      const { ...restOfSubmissionData } = submissionData;

const submissionWithTimestamp = {
  ...restOfSubmissionData, // Spread all other fields except file
  fileURL: fileURL || null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  status: 'pending'
};

  
      const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), submissionWithTimestamp);
      
      return {
        id: docRef.id,
        ...submissionWithTimestamp
      };
    } catch (error) {
      console.error('Error submitting resource:', error);
      throw error;
    }
  };
  
  /**
   * Get all pending submissions
   * @returns {Promise<Array>} - Array of pending submissions
   */
  export const getPendingSubmissions = async () => {
    try {
      const q = query(
        collection(db, SUBMISSIONS_COLLECTION),
        where('status', '==', 'pending')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting pending submissions:', error);
      throw error;
    }
  };
  
  /**
   * Get all submissions with any status
   * @returns {Promise<Array>} - Array of all submissions
   */
  export const getAllSubmissions = async () => {
    try {
      const snapshot = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all submissions:', error);
      throw error;
    }
  };
  
  /**
   * Approve a submission and add it to the appropriate subject
   * @param {string} submissionId - The ID of the submission to approve
   * @returns {Promise<Object>} - The result of the approval
   */
  export const approveSubmission = async (submissionId) => {
    try {
      // Get the submission
      const submissionRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
      const submissionSnap = await getDoc(submissionRef);
      
      if (!submissionSnap.exists()) {
        throw new Error(`Submission with ID ${submissionId} not found`);
      }
      
      const submission = submissionSnap.data();
      
      // Detailed logging
      console.log('Full submission data:', submission);
      console.log('Submission subject ID:', submission.subjectId);
      
      // Validate required fields with more detailed error
      if (!submission.subjectId) {
        const detailedError = new Error('Subject must be selected before approving the submission');
        detailedError.submissionData = submission;
        throw detailedError;
      }
      // Process based on resource type
      let result;
      switch(submission.resourceType) {
        case 'chapter':
          result = await addChapter(submission.subjectId, {
            title: submission.title,
            description: submission.description,
            driveEmbedUrl: submission.url || submission.fileURL
          });
          break;
          
        case 'video':
          result = await addVideoLecture(submission.subjectId, {
            title: submission.title,
            description: submission.description,
            url: submission.url,
            iframe: `<iframe width="1057" height="595" src="${submission.url}" title="${submission.title}" frameborder="0" allowfullscreen></iframe>`
          });
          break;
          
        case 'pyq':
          result = await addPreviousYearQuestion(submission.subjectId, {
            title: submission.title,
            description: submission.description,
            fileUrl: submission.url || submission.fileURL,
            year: submission.title.split(' ')[0] || 'Unknown',
            semester: 'End-sem',
            type: 'all units'
          });
          break;
          
        case 'assignment':
          result = await addAssignment(submission.subjectId, {
            title: submission.title,
            description: submission.description,
            fileUrl: submission.url || submission.fileURL,
            deadline: 'TBD'
          });
          break;
          
        default:
          throw new Error(`Invalid resource type: ${submission.resourceType}`);
      }
      
      // Update submission status to approved
      await updateDoc(submissionRef, {
        status: 'approved',
        updatedAt: serverTimestamp(),
        approvedAt: serverTimestamp()
      });
      
      return {
        success: true,
        result
      };
    } catch (error) {
       console.error('Detailed approval error:', {
      error,
      submissionData: error.submissionData,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};
  
  /**
   * Reject a submission
   * @param {string} submissionId - The ID of the submission to reject
   * @param {string} reason - The reason for rejection
   * @returns {Promise<Object>} - The result of the rejection
   */
  export const rejectSubmission = async (submissionId, reason = '') => {
    try {
      const submissionRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
      
      await updateDoc(submissionRef, {
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: serverTimestamp(),
        rejectedAt: serverTimestamp()
      });
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error rejecting submission:', error);
      throw error;
    }
  };
  
  /**
   * Delete a submission
   * @param {string} submissionId - The ID of the submission to delete
   * @returns {Promise<Object>} - The result of the deletion
   */
  export const deleteSubmission = async (submissionId) => {
    try {
      const submissionRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
      await deleteDoc(submissionRef);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting submission:', error);
      throw error;
    }
  };
  
  export default {
    submitResource,
    getPendingSubmissions,
    getAllSubmissions,
    approveSubmission,
    rejectSubmission,
    deleteSubmission
  };