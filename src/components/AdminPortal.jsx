import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import './AdminPortal.css';
import { isNetworkError, showNetworkErrorNotification } from '../utils/networkErrorHandler.jsx';
// Import Firebase services
import {
  getAllSubjects,
  getAllSemesters,
  addSubject,
  deleteSubject,
  addChapter,
  
  addVideoLecture,
  updateSubjectsOrder,
  addPreviousYearQuestion,
  addAssignment,
  getAllAdmins,
  addAdminByEmail,
  removeAdminStatus,
  deleteResourceFromSubject,
  updateSubject
} from '../firebase/dataService';

// Define owner emails
const OWNER_EMAILS = [
  'discordakshat04@gmail.com', 
  'akshatvaidik@gmail.com'
];

const AdminPortal = () => {
  const { userProfile, isLoggedIn, isAdmin, loading } = useUser();
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editItemType, setEditItemType] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('');
  
// Add these new state variables at the top of your AdminPortal component
const [editSubjectModalOpen, setEditSubjectModalOpen] = useState(false);
const [editSubject, setEditSubject] = useState(null);



  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  
  // Check if the current user is an owner
  const isOwner = OWNER_EMAILS.includes(userProfile?.email);
  
  // Add these three functions near your other handler functions like handleReorder, openEditModal, etc.
// For example, below your existing handleResourceReorder or openEditModal functions

const openEditSubjectModal = (subjectId, subject) => {
  setEditSubject({...subject});
  setEditSubjectModalOpen(true);
};

const closeEditSubjectModal = () => {
  setEditSubjectModalOpen(false);
  setEditSubject(null);
};

const saveSubjectEdit = async () => {
  if (!editSubject) {
    closeEditSubjectModal();
    return;
  }
  
  try {
    setIsLoading(true);
    
    // Update the subject in Firebase
    const updatedSubject = await updateSubject(editSubject.id, editSubject);
    
    // Update local state
    const updatedSubjects = subjects.map(subject => 
      subject.id === editSubject.id ? updatedSubject : subject
    );
    
    setSubjects(updatedSubjects);
    setIsLoading(false);
    closeEditSubjectModal();
    alert('Subject updated successfully!');
  } catch (error) {
    console.error('Error updating subject:', error);
    alert('Failed to update subject. Please try again.');
    setIsLoading(false);
  }
};
  // Form states
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    description: '',
    instructor: '',
    credits: 4,
    semesterId: 1,
    syllabusUrl: ''
  });
  
  const [newChapter, setNewChapter] = useState({
    title: '',
    description: '',
    driveEmbedUrl: '',
    subjectId: '',
    semesterId: 1
  });
  
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'video', // video, pyq, assignment
    url: '',
    description: '',
    subjectId: '',
    semesterId: 1
  });

  // Load data
  const normalizeGoogleDriveUrl = (url) => {
    if (!url) return url;
  
    // Trim whitespace
    url = url.trim();

    const folderMatch = url.match(/https:\/\/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) {
    // Return the folder URL as is, or standardize it if needed
    return `https://drive.google.com/drive/folders/${folderMatch[1]}`;
  }
  
    // Patterns for different Google Drive URL formats
    const patterns = [
      // Direct file view link
      /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/(view|edit|preview)\??/,
      
      // Folder link
      /https:\/\/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)\??/,
      
      // Open link
      /https:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,

      /https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)\/edit\?usp=sharing(&.+)?/,
      
      // Docs link
      /https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)\/(edit|view|preview)\??/,
      
      // Sheets link
      /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)\/(edit|view|preview)\??/,
      
      // Presentation link
      /https:\/\/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)\/(edit|view|preview)\??/
    ];
  
    // Try each pattern
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const fileId = match[1];
        // Return a standardized view link
        return `https://drive.google.com/file/d/${fileId}/view`;
      }
    }
  
    // If no match found, return original URL
    return url;
  };
  
  // Modify the input handlers in the component
  const handleChapterUrlChange = (e) => {
    const rawUrl = e.target.value;
    const normalizedUrl = normalizeGoogleDriveUrl(rawUrl);
    setNewChapter({...newChapter, driveEmbedUrl: normalizedUrl});
  };
  
  const handleResourceUrlChange = (e) => {
    const rawUrl = e.target.value;
    
    // For video, keep YouTube URL validation
    if (newResource.type === 'video') {
      setNewResource({...newResource, url: rawUrl});
    } else {
      // For other resources (PYQ, assignments), normalize Google Drive URL
      const normalizedUrl = normalizeGoogleDriveUrl(rawUrl);
      setNewResource({...newResource, url: normalizedUrl});
    }
  };
    
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load semesters
        const semesterList = await getAllSemesters();
        setSemesters(semesterList);
        
        // Load subjects
        const allSubjects = await getAllSubjects();
        setSubjects(allSubjects);
        
        // Fetch admins
        const adminList = await getAllAdmins();
        setAdmins(adminList);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading admin data:", error);
        
        // Import at the top of the file
       
        
        if (isNetworkError(error)) {
          showNetworkErrorNotification({
            message: 'Unable to load admin data. Please check your internet connection.'
          });
        } else {
          alert('An unexpected error occurred. Please try again later.');
        }
        
        setIsLoading(false);
      }
    };
    
    // Call the load data function
    loadData();
  }, []); // Empty dependency array to ru
  
  
  // Separate function to fetch admins
// Modify handleAddAdmin to refresh the admin list after adding
const handleAddAdmin = async (e) => {
  e.preventDefault();
  
  try {
    setIsLoading(true);
    
    const result = await addAdminByEmail(newAdminEmail);
    
    if (result.success) {
      // Immediately refetch the admin list
      const updatedAdminList = await getAllAdmins();
      setAdmins(updatedAdminList);
      
      setNewAdminEmail('');
      alert('Admin added successfully!');
    } else {
      alert(result.message);
    }
  }catch (error) {
      console.error("Error adding admin:", error);
      
      if (isNetworkError(error)) {
        showNetworkErrorNotification({
          message: 'Unable to add admin. Please check your internet connection.'
        });
      } else {
        alert('An unexpected error occurred. Please try again later.');
      }
      
      setIsLoading(false);
    }
};
// Similar modification for handleRemoveAdmin
const handleRemoveAdmin = async (userId, userEmail) => {
  // First, check if the current user is an owner
  if (!isOwner) {
    alert('Only the owner can remove admin status.');
    return;
  }

  // Prevent removing owner admins
  const OWNER_EMAILS = [
    'discordakshat04@gmail.com', 
    'akshatvaidik@gmail.com'
  ];

  if (OWNER_EMAILS.includes(userEmail)) {
    alert('Cannot remove owner admin status.');
    return;
  }

  const confirmRemove = window.confirm(
    "Are you sure you want to remove this admin's status?"
  );
  
  if (confirmRemove) {
    try {
      setIsLoading(true);
      
      const success = await removeAdminStatus(userId);
      
      if (success) {
        // Immediately refetch the admin list
        const updatedAdminList = await getAllAdmins();
        setAdmins(updatedAdminList);
        
        alert('Admin status removed successfully!');
      } else {
        alert('Failed to remove admin status.');
      }
    } catch (error) {
      console.error("Error removing admin:", error);
      
      if (isNetworkError(error)) {
        showNetworkErrorNotification({
          message: 'Unable to remove admin. Please check your internet connection.'
        });
      } else {
        alert('An unexpected error occurred. Please try again later.');
      }
      
      setIsLoading(false);
    }
  }
};
  // Handle subject submission
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Add the new subject to Firebase
      const newSubjectData = await addSubject(newSubject);
      
      // Update local state
      setSubjects([...subjects, newSubjectData]);
      
      // Reset form
      setNewSubject({
        name: '',
        code: '',
        description: '',
        instructor: '',
        credits: 4,
        semesterId: 1,
        syllabusUrl: ''
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject. Please try again.");
      setIsLoading(false);
    }
  };

  // Add this function to your AdminPortal.jsx component

// NEW: Handle reordering of subjects
// Improved Subject Reordering Function
// Flexible Subject Reordering Function
const handleSubjectReorder = async (semesterId, subjectId, direction) => {
  try {
    console.group('🔍 Subject Reordering Diagnostic');
    console.log('Input Parameters:', { semesterId, subjectId, direction });

    // Get subjects for this semester only, from the current state
    const semesterSubjects = subjects
      .filter(subject => subject.semesterId === semesterId)
      .sort((a, b) => {
        // Ensure numeric sorting by displayOrder
        const orderA = typeof a.displayOrder === 'number' ? a.displayOrder : 999;
        const orderB = typeof b.displayOrder === 'number' ? b.displayOrder : 999;
        return orderA - orderB;
      });
    
    console.log('Filtered Semester Subjects:', semesterSubjects.map(s => ({
      id: s.id, 
      name: s.name, 
      displayOrder: s.displayOrder
    })));

    // Find the current index of the subject
    const currentIndex = semesterSubjects.findIndex(subject => 
      String(subject.id) === String(subjectId)
    );

    console.log('Current Index:', currentIndex);
    
    // Validate index
    if (currentIndex === -1) {
      console.error(`❌ Subject with ID ${subjectId} not found in semester ${semesterId}`);
      console.groupEnd();
      alert('Subject not found in this semester.');
      return;
    }
    
    // Determine new index
    let newIndex;
    if (direction === 'up') {
      if (currentIndex <= 0) {
        console.log('❗ Cannot move subject up further - already at top');
        console.groupEnd();
        alert('This subject is already at the top of the list.');
        return;
      }
      newIndex = currentIndex - 1;
    } else if (direction === 'down') {
      if (currentIndex >= semesterSubjects.length - 1) {
        console.log('❗ Cannot move subject down further - already at bottom');
        console.groupEnd();
        alert('This subject is already at the bottom of the list.');
        return;
      }
      newIndex = currentIndex + 1;
    }

    console.log('New Index:', newIndex);
    
    // Create a new array with the reordered items
    const reorderedSubjects = [...semesterSubjects];
    
    // Swap the items
    [reorderedSubjects[currentIndex], reorderedSubjects[newIndex]] = 
      [reorderedSubjects[newIndex], reorderedSubjects[currentIndex]];
    
    // Update the displayOrder values
    reorderedSubjects.forEach((subject, index) => {
      subject.displayOrder = index;
    });
    
    console.log('Reordered Subjects:', reorderedSubjects.map(s => ({
      id: s.id, 
      name: s.name, 
      displayOrder: s.displayOrder
    })));

    // Show loading state
    setIsLoading(true);
    
    // Update in Firebase
    await updateSubjectsOrder(semesterId, reorderedSubjects);
    
    // IMPORTANT: Update the local subjects state
    // First, get all subjects that are NOT in this semester
    const otherSubjects = subjects.filter(subject => subject.semesterId !== semesterId);
    
    // Then, create a new merged array with the reordered subjects
    const updatedAllSubjects = [...otherSubjects, ...reorderedSubjects];
    
    // Update the component state
    setSubjects(updatedAllSubjects);
    
    setIsLoading(false);
    
    console.log('✅ Subject order updated successfully');
    console.groupEnd();
  } catch (error) {
    console.error('❌ Detailed Reordering Error:', error);
    console.groupEnd();
    
    alert('Failed to reorder subjects. Please try again.');
    setIsLoading(false);
  }
};
  // Handle chapter submission
  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newChapter.subjectId) {
      alert('Please select a subject');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Add the chapter to the subject in Firebase
      const updatedSubject = await addChapter(newChapter.subjectId, {
        title: newChapter.title,
        description: newChapter.description,
        driveEmbedUrl: newChapter.driveEmbedUrl
      });
      
      // Update the subjects array with the updated subject
      const updatedSubjects = subjects.map(subject => 
        subject.id === newChapter.subjectId ? updatedSubject : subject
      );
      
      setSubjects(updatedSubjects);
      
      // Reset form but keep the selected subject and semester
      setNewChapter({
        title: '',
        description: '',
        driveEmbedUrl: '',
        subjectId: newChapter.subjectId,
        semesterId: newChapter.semesterId
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding chapter:", error);
      alert("Failed to add chapter. Please try again.");
      setIsLoading(false);
    }
  };
  
  // Handle resource submission (videos, pyqs, assignments)
  // Enhanced resource submission handlers with detailed error logging
  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    
    // Early validation checks
    if (!newResource.subjectId) {
      alert('Please select a subject');
      return;
    }
  
    // Validate all required fields
    const requiredFields = ['title', 'url', 'description', 'type'];
    for (let field of requiredFields) {
      if (!newResource[field] || newResource[field].trim() === '') {
        alert(`Please fill in the ${field} field`);
        return;
      }
    }
    
    try {
      setIsLoading(true);
      
      // Comprehensive logging for debugging
      console.group('🔍 Resource Submission Diagnostics');
      console.log('Admin Status:', { 
        isLoggedIn: isLoggedIn, 
        isAdmin: isAdmin,
        userEmail: userProfile?.email 
      });
      console.log('Resource Details:', { 
        type: newResource.type,
        subjectId: newResource.subjectId,
        title: newResource.title, 
        description: newResource.description, 
        url: newResource.url 
      });
      
      // Enhanced URL validation
      const validateUrl = (url, type) => {
        if (!url) {
          throw new Error(`${type} URL is required`);
        }
        
        // Specific URL validation rules
        const validationRules = {
          'video': /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
          'pyq': /^(https?:\/\/)?(drive\.google\.com)\/.+$/,
          'assignment': /^(https?:\/\/)?(drive\.google\.com)\/.+$/
        };
        
        const regex = validationRules[type];
        if (regex && !regex.test(url)) {
          throw new Error(`Invalid ${type} URL format`);
        }
      };
      
      // Validate URL 
      validateUrl(newResource.url, newResource.type);
      
      // Resource addition logic
      let updatedSubject;
      switch(newResource.type) {
        case 'video':
          updatedSubject = await addVideoLecture(newResource.subjectId, {
            title: newResource.title,
            description: newResource.description,
            url: newResource.url,
            iframe: `<iframe width="1057" height="595" src="${newResource.url}" title="${newResource.title}" frameborder="0" allowfullscreen></iframe>`
          });
          break;
          
        case 'pyq':
          updatedSubject = await addPreviousYearQuestion(newResource.subjectId, {
            title: newResource.title,
            description: newResource.description,
            fileUrl: newResource.url,
            year: newResource.title.split(' ')[0] || 'Unknown',
            semester: 'End-sem',
            type: 'all units'
          });
          break;
          
        case 'assignment':
          updatedSubject = await addAssignment(newResource.subjectId, {
            title: newResource.title,
            description: newResource.description,
            fileUrl: newResource.url,
            deadline: 'TBD'
          });
          break;
          
        default:
          throw new Error(`Invalid resource type: ${newResource.type}`);
      }
      
      console.log('Updated Subject:', updatedSubject);
      console.groupEnd();
      
      // Update subjects state
      const updatedSubjects = subjects.map(subject => 
        subject.id === newResource.subjectId ? updatedSubject : subject
      );
      
      setSubjects(updatedSubjects);
      
      // Reset form, maintaining context
      setNewResource({
        title: '',
        type: newResource.type,
        url: '',
        description: '',
        subjectId: newResource.subjectId,
        semesterId: newResource.semesterId
      });
      
      setIsLoading(false);
      alert('🎉 Resource added successfully!');
    } catch (error) {
      console.error('❌ Resource Addition Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Detailed error handling
      const errorMessage = error.message.includes('URL') 
        ? `URL Error: ${error.message}` 
        : 'Failed to add resource. Please check your inputs and try again.';
      
      alert(errorMessage);
      setIsLoading(false);
    }
  };

  // NEW: Open the edit modal for a resource
const openEditModal = (subjectId, resourceType, item) => {
  setEditSubjectId(subjectId);
  setEditItemType(resourceType);
  setEditItem({...item});
  setEditModalOpen(true);
};

// NEW: Close the edit modal
const closeEditModal = () => {
  setEditModalOpen(false);
  setEditItem(null);
  setEditItemType('');
  setEditSubjectId('');
};

// NEW: Save edits to a resource
const saveResourceEdit = async () => {
  if (!editItem || !editSubjectId || !editItemType) {
    closeEditModal();
    return;
  }
  
  try {
    setIsLoading(true);
    
    // Find the subject
    const subject = subjects.find(s => s.id === editSubjectId);
    if (!subject) {
      throw new Error('Subject not found');
    }
    
    // Determine which array to update
    let arrayKey;
    switch(editItemType) {
      case 'chapter': arrayKey = 'chapters'; break;
      case 'video': arrayKey = 'videoLectures'; break;
      case 'pyq': arrayKey = 'previousYearQuestions'; break;
      case 'assignment': arrayKey = 'assignments'; break;
      default:
        throw new Error(`Invalid resource type: ${editItemType}`);
    }
    
    // Create updated array with edited item
    const updatedArray = (subject[arrayKey] || []).map(item => 
      item.id === editItem.id ? editItem : item
    );
    
    // Update in Firebase
    const updatedSubject = await updateSubject(editSubjectId, {
      [arrayKey]: updatedArray
    });
    
    // Update local state
    const updatedSubjects = subjects.map(subject => 
      subject.id === editSubjectId ? updatedSubject : subject
    );
    
    setSubjects(updatedSubjects);
    setIsLoading(false);
    closeEditModal();
    alert('Resource updated successfully!');
  } catch (error) {
    console.error('Error updating resource:', error);
    alert('Failed to update resource. Please try again.');
    setIsLoading(false);
  }
};

// NEW: Handle reordering of resources
const handleResourceReorder = async (subjectId, resourceType, resourceId, direction) => {
  try {
    // Find the subject
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    // Determine which array to update
    let arrayKey;
    switch(resourceType) {
      case 'chapter': arrayKey = 'chapters'; break;
      case 'video': arrayKey = 'videoLectures'; break;
      case 'pyq': arrayKey = 'previousYearQuestions'; break;
      case 'assignment': arrayKey = 'assignments'; break;
      default: return;
    }
    
    // Get the array
    const resourceArray = subject[arrayKey] || [];
    
    // Find the item index
    const itemIndex = resourceArray.findIndex(item => item.id === resourceId);
    if (itemIndex === -1) return;
    
    // Determine new index based on direction
    const newIndex = direction === 'up' 
      ? Math.max(0, itemIndex - 1) 
      : Math.min(resourceArray.length - 1, itemIndex + 1);
    
    // If the index didn't change, do nothing
    if (newIndex === itemIndex) return;
    
    // Create a new array with the reordered items
    const newArray = [...resourceArray];
    const [movedItem] = newArray.splice(itemIndex, 1);
    newArray.splice(newIndex, 0, movedItem);
    
    // Update in Firebase
    const updatedSubject = await updateSubject(subjectId, {
      [arrayKey]: newArray
    });
    
    // Update local state
    const updatedSubjects = subjects.map(subject => 
      subject.id === subjectId ? updatedSubject : subject
    );
    
    setSubjects(updatedSubjects);
  } catch (error) {
    console.error('Error reordering resource:', error);
    alert('Failed to reorder resource. Please try again.');
  }
};

  // Delete subject
  const deleteSubjectHandler = async (subjectId) => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to delete this subject?\n\n" +
      "This action will permanently remove the subject and all its associated resources:\n" +
      "- Chapters\n" +
      "- Video Lectures\n" +
      "- Previous Year Questions\n" +
      "- Assignments\n\n" +
      "This CANNOT be undone!"
    );
  
    if (confirmDelete) {
      try {
        setIsLoading(true);
        
        // Delete from Firebase
        await deleteSubject(subjectId);
        
        // Update local state
        const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
        setSubjects(updatedSubjects);
        
        setIsLoading(false);
        alert('Subject has been deleted successfully.');
      } catch (error) {
        console.error("Error deleting subject:", error);
        alert("Failed to delete subject. Please try again.");
        setIsLoading(false);
      }
    }
  };
  
  // Delete a resource (chapter, video, assignment, pyq)
  const deleteResourceHandler = async (subjectId, resourceType, resourceId) => {
    const resourceTypeName = 
      resourceType === 'chapter' ? 'chapter' :
      resourceType === 'video' ? 'video lecture' :
      resourceType === 'pyq' ? 'previous year question' :
      'assignment';
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${resourceTypeName}?\n\n` +
      "This action cannot be undone."
    );
  
    if (confirmDelete) {
      try {
        setIsLoading(true);
        
        // Delete from Firebase
        const updatedSubject = await deleteResourceFromSubject(subjectId, resourceType, resourceId);
        
        // Update local state
        const updatedSubjects = subjects.map(subject => 
          subject.id === subjectId ? updatedSubject : subject
        );
        
        setSubjects(updatedSubjects);
        
        setIsLoading(false);
        alert(`${resourceTypeName.charAt(0).toUpperCase() + resourceTypeName.slice(1)} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting ${resourceTypeName}:`, error);
        alert(`Failed to delete ${resourceTypeName}. Please try again.`);
        setIsLoading(false);
      }
    }
  };
  // NEW: Edit Resource Modal Component
const EditResourceModal = () => {
  if (!editModalOpen || !editItem) return null;
  
  // Form field change handler
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for URL fields
    if (name === 'driveEmbedUrl' || name === 'fileUrl' || name === 'url') {
      // Normalize Google Drive URLs
      const normalizedValue = normalizeGoogleDriveUrl(value);
      setEditItem(prev => ({
        ...prev,
        [name]: normalizedValue
      }));
    } else {
      // Regular handling for other fields
      setEditItem(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Different fields based on resource type
  const renderFormFields = () => {
    switch(editItemType) {
      case 'chapter':
        return (
          <>
            <div className="form-group">
              <label>Chapter Title</label>
              <input 
                type="text" 
                name="title"
                value={editItem.title || ''}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description"
                value={editItem.description || ''}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Google Drive URL</label>
              <input 
                type="url" 
                name="driveEmbedUrl"
                value={editItem.driveEmbedUrl || ''}
                onChange={handleEditChange}
                placeholder="https://drive.google.com/file/d/..."
              />
              <small className="form-hint">Use the "Share" link from Google Drive</small>
            </div>
          </>
        );
        
      case 'video':
        return (
          <>
            <div className="form-group">
              <label>Video Title</label>
              <input 
                type="text" 
                name="title"
                value={editItem.title || ''}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description"
                value={editItem.description || ''}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>YouTube URL</label>
              <input 
                type="url" 
                name="url"
                value={editItem.url || ''}
                onChange={handleEditChange}
                placeholder="https://www.youtube.com/embed/..."
              />
              <small className="form-hint">Use the embed URL from YouTube (click Share &gt; Embed &gt; copy src URL)</small>
            </div>
          </>
        );
        
      case 'pyq':
        return (
          <>
            <div className="form-group">
              <label>Year & Semester</label>
              <input 
                type="text" 
                name="title"
                value={editItem.title || ''}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description"
                value={editItem.description || ''}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Google Drive URL</label>
              <input 
                type="url" 
                name="fileUrl"
                value={editItem.fileUrl || ''}
                onChange={handleEditChange}
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
          </>
        );
        
      case 'assignment':
        return (
          <>
            <div className="form-group">
              <label>Assignment Title</label>
              <input 
                type="text" 
                name="title"
                value={editItem.title || ''}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description"
                value={editItem.description || ''}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Google Drive URL</label>
              <input 
                type="url" 
                name="fileUrl"
                value={editItem.fileUrl || ''}
                onChange={handleEditChange}
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input 
                type="text" 
                name="deadline"
                value={editItem.deadline || ''}
                onChange={handleEditChange}
                placeholder="e.g., May 15, 2025"
              />
            </div>
          </>
        );
        
      default:
        return <p>Unknown resource type</p>;
    }
  };
  
  // Modal title based on resource type
  const getModalTitle = () => {
    switch(editItemType) {
      case 'chapter': return 'Edit Chapter';
      case 'video': return 'Edit Video Lecture';
      case 'pyq': return 'Edit Previous Year Question';
      case 'assignment': return 'Edit Assignment';
      default: return 'Edit Resource';
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>{getModalTitle()}</h3>
          <button className="close-modal-btn" onClick={closeEditModal}>×</button>
        </div>
        <div className="edit-modal-body">
          {renderFormFields()}
        </div>
        <div className="edit-modal-footer">
          <button className="cancel-btn" onClick={closeEditModal}>Cancel</button>
          <button className="save-btn" onClick={saveResourceEdit}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};
  
  // Filter subjects by semester
  const getSubjectsBySemester = (semId) => {
    return subjects.filter(subject => subject.semesterId === semId);
  };

  if (loading || isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-portal not-authorized">
        <div className="container">
          <h1>Admin Portal</h1>
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You do not have permission to access the admin portal. Please contact the site administrator if you believe this is an error.</p>
            <div>
              <p>Debug info:</p>
              <p>Logged in: {isLoggedIn ? 'Yes' : 'No'}</p>
              <p>Email: {userProfile?.email || 'No email found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Portal</h1>
          <p>Manage academic content across semesters and subjects</p>
        </div>
        
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            Subjects
          </button>
          <button 
            className={`admin-tab ${activeTab === 'chapters' ? 'active' : ''}`}
            onClick={() => setActiveTab('chapters')}
          >
            Chapters
          </button>
          <button 
            className={`admin-tab ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button 
            className={`admin-tab ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            View Data
          </button>
          <button 
  className={`admin-tab ${activeTab === 'admin-management' ? 'active' : ''}`}
  onClick={() => setActiveTab('admin-management')}
>
  Admin Management
</button>
        </div>
        
<div className="admin-content">
{activeTab === 'admin-management' && (
        <div className="admin-section admin-management">
          <h2>Admin Management</h2>
          
          {/* Add New Admin Form - Only visible to owners */}
          {isOwner && (
            <div className="add-admin-section">
              <h3>Add New Admin</h3>
              <form onSubmit={handleAddAdmin} className="admin-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="Enter user's email"
                    required
                  />
                </div>
                <button type="submit" className="admin-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Admin'}
                </button>
              </form>
            </div>
          )}
          
          {/* Current Admins List */}
          <div className="current-admins-section">
            <h3>Current Admins</h3>
            {admins.length > 0 ? (
              <div className="admin-list">
                {admins.map(admin => (
                  <div key={admin.id} className="admin-item">
                    <div className="admin-info">
                      <img 
                        src={admin.picture} 
                        alt={admin.name} 
                        className="admin-avatar"
                      />
                      <div className="admin-details">
                        <h4>{admin.name}</h4>
                        <p>{admin.email}</p>
                        {/* Highlight owners */}
                        {OWNER_EMAILS.includes(admin.email) && (
                          <span className="owner-badge">Owner</span>
                        )}
                      </div>
                    </div>
                    {/* Show remove button only if current user is an owner and not removing themselves */}
                    {isOwner && admin.id !== userProfile?.id && (
                      <button 
                        className="remove-admin-btn" 
                        onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                      >
                        Remove Admin
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No other admins found.</p>
            )}
          </div>
        </div>
      )}
  {activeTab === 'subjects' && (
    <div className="admin-section">
      <h2>Add New Subject</h2>
      <form onSubmit={handleSubjectSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Subject Name</label>
            <input 
              type="text" 
              value={newSubject.name}
              onChange={e => setNewSubject({...newSubject, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Subject Code</label>
            <input 
              type="text" 
              value={newSubject.code}
              onChange={e => setNewSubject({...newSubject, code: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Subject Icon (Emoji)</label>
            <input 
              type="text" 
              value={newSubject.icon}
              onChange={e => setNewSubject({...newSubject, icon: e.target.value})}
              placeholder="📚 📝 🧮 ⚛️ 🔬"
              maxLength="2"
            />
            <small className="form-hint">Enter a single emoji as the subject icon</small>
          </div>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={newSubject.description}
            onChange={e => setNewSubject({...newSubject, description: e.target.value})}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Instructor</label>
            <input 
              type="text" 
              value={newSubject.instructor}
              onChange={e => setNewSubject({...newSubject, instructor: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Credits</label>
            <input 
              type="number" 
              value={newSubject.credits}
              onChange={e => setNewSubject({...newSubject, credits: parseInt(e.target.value)})}
              min="1"
              max="6"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Semester</label>
            <select 
              value={newSubject.semesterId}
              onChange={e => setNewSubject({...newSubject, semesterId: parseInt(e.target.value)})}
              required
            >
              {semesters.map(sem => (
                <option key={sem.id} value={sem.id}>
                  {sem.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Syllabus URL (Google Drive)</label>
            <input 
              type="url" 
              value={newSubject.syllabusUrl}
              onChange={e => setNewSubject({...newSubject, syllabusUrl: e.target.value})}

              placeholder="https://drive.google.com/file/d/..."
            />
          </div>
        </div>
        
        <button type="submit" className="admin-submit-btn">Add Subject</button>
      </form>
    </div>
  )}
          
          {activeTab === 'chapters' && (
            <div className="admin-section">
              <h2>Add New Chapter</h2>
              <form onSubmit={handleChapterSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Semester</label>
                    <select 
                      value={newChapter.semesterId}
                      onChange={e => setNewChapter({...newChapter, semesterId: parseInt(e.target.value), subjectId: ''})}
                      required
                    >
                      {semesters.map(sem => (
                        <option key={sem.id} value={sem.id}>
                          {sem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Subject</label>
                    <select 
                      value={newChapter.subjectId}
                      onChange={e => setNewChapter({...newChapter, subjectId: e.target.value})}
                      required
                    >
                      <option value="">Select Subject</option>
                      {getSubjectsBySemester(newChapter.semesterId).map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Chapter Title</label>
                  <input 
                    type="text" 
                    value={newChapter.title}
                    onChange={e => setNewChapter({...newChapter, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={newChapter.description}
                    onChange={e => setNewChapter({...newChapter, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Google Drive URL</label>
                  <input 
                    type="url" 
                    value={newChapter.driveEmbedUrl}
                    onChange={handleChapterUrlChange}

                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                  <small className="form-hint">Use the "Share" link from Google Drive</small>
                </div>
                
                <button type="submit" className="admin-submit-btn">Add Chapter</button>
              </form>
            </div>
          )}
          
          {activeTab === 'resources' && (
            <div className="admin-section">
              <h2>Add New Resource</h2>
              <form onSubmit={handleResourceSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Semester</label>
                    <select 
                      value={newResource.semesterId}
                      onChange={e => setNewResource({...newResource, semesterId: parseInt(e.target.value), subjectId: ''})}
                      required
                    >
                      {semesters.map(sem => (
                        <option key={sem.id} value={sem.id}>
                          {sem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Subject</label>
                    <select 
                      value={newResource.subjectId}
                      onChange={e => setNewResource({...newResource, subjectId: e.target.value})}
                      required
                    >
                      <option value="">Select Subject</option>
                      {getSubjectsBySemester(newResource.semesterId).map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Resource Type</label>
                    <select 
                      value={newResource.type}
                      onChange={e => setNewResource({...newResource, type: e.target.value})}
                      required
                    >
                      <option value="video">Video Lecture</option>
                      <option value="pyq">Previous Year Question</option>
                      <option value="assignment">Assignment</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>{newResource.type === 'pyq' ? 'Year & Semester' : 'Title'}</label>
                    <input 
                      type="text" 
                      value={newResource.title}
                      onChange={e => setNewResource({...newResource, title: e.target.value})}
                      placeholder={newResource.type === 'pyq' ? 'e.g. 2023 End-Sem' : 'Resource title'}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={newResource.description}
                    onChange={e => setNewResource({...newResource, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{newResource.type === 'video' ? 'YouTube URL' : 'Google Drive URL'}</label>
                  <input 
                    type="url" 
                    value={newResource.url}
                    onChange={handleResourceUrlChange}
                    placeholder={newResource.type === 'video' ? 'https://www.youtube.com/embed/...' : 'https://drive.google.com/file/d/...'}
                    required
                  />
                  <small className="form-hint">
                    {newResource.type === 'video' 
                      ? 'Use the embed URL from YouTube (click Share > Embed > copy src URL)' 
                      : 'Use the "Share" link from Google Drive'}
                  </small>
                </div>
                
                <button type="submit" className="admin-submit-btn">Add Resource</button>
              </form>
            </div>
          )}
          
          

          {activeTab === 'view' && (
  <div className="admin-section">
    <h2>View Subjects Data</h2>
    <div className="admin-data-view">
    {semesters.map(semester => (
  <div key={semester.id} id={`semester-${semester.id}`} className="semester-data">
    <h3>{semester.name}</h3>
    {/* Replace the existing way you get subjects with this approach */}
    {(() => {
      // Get and sort subjects for this semester inside the render function
      const semesterSubjects = subjects
        .filter(subject => subject.semesterId === semester.id)
        .sort((a, b) => {
          // Ensure numeric sorting by displayOrder
          const orderA = typeof a.displayOrder === 'number' ? a.displayOrder : 999;
          const orderB = typeof b.displayOrder === 'number' ? b.displayOrder : 999;
          return orderA - orderB;
        });
      
      console.log(`Rendering ${semesterSubjects.length} subjects for semester ${semester.id}`);
      
      return semesterSubjects.length > 0 ? (
        semesterSubjects.map((subject, index) => (
          <div key={subject.id} className="subject-item">
            <div className="item-content">
              <span className="item-title">{subject.name} ({subject.code}) - Order: {subject.displayOrder}</span>
            </div>
            <div className="item-actions">
  {/* Reorder buttons */}
  <div className="reorder-buttons">
    <button 
      className="reorder-btn up"
      onClick={() => handleSubjectReorder(semester.id, subject.id, 'up')}
      disabled={index === 0}
      title="Move Up"
    >
      ↑
    </button>
    <button 
      className="reorder-btn down"
      onClick={() => handleSubjectReorder(semester.id, subject.id, 'down')}
      disabled={index === (semesterSubjects.length - 1)}
      title="Move Down"
    >
      ↓
    </button>
  </div>
  
  {/* Edit and delete buttons */}
  <button 
    className="edit-btn" 
    onClick={() => openEditSubjectModal(subject.id, subject)}
    title="Edit Subject"
  >
    Edit
  </button>
  
  <button 
    className="delete-btn" 
    onClick={() => deleteSubjectHandler(subject.id)}
  >
    Delete Subject
  </button>
</div>
                
                {/* Chapters Section */}
                <div className="subject-chapters">
                  <h5>Chapters</h5>
                  {subject.chapters && subject.chapters.length > 0 ? (
                    subject.chapters.map((chapter, index) => (
                      <div key={chapter.id} className="chapter-item">
                        <div className="item-content">
                          <span className="item-title">{chapter.title}</span>
                        </div>
                        <div className="item-actions">
                          {/* Reorder buttons */}
                          <div className="reorder-buttons">
                            <button 
                              className="reorder-btn up"
                              onClick={() => handleResourceReorder(subject.id, 'chapter', chapter.id, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button 
                              className="reorder-btn down"
                              onClick={() => handleResourceReorder(subject.id, 'chapter', chapter.id, 'down')}
                              disabled={index === (subject.chapters.length - 1)}
                              title="Move Down"
                            >
                              ↓
                            </button>
                          </div>
                          <button 
                            className="edit-btn" 
                            onClick={() => openEditModal(subject.id, 'chapter', chapter)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => deleteResourceHandler(subject.id, 'chapter', chapter.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No chapters added yet</p>
                  )}
                </div>
                
                {/* Video Lectures Section */}
                <div className="subject-videos">
                  <h5>Video Lectures</h5>
                  {subject.videoLectures && subject.videoLectures.length > 0 ? (
                    subject.videoLectures.map((video, index) => (
                      <div key={video.id} className="video-item">
                        <span>{video.title}</span>
                        <div className="item-actions">
                          {/* Reorder buttons */}
                          <div className="reorder-buttons">
                            <button 
                              className="reorder-btn up"
                              onClick={() => handleResourceReorder(subject.id, 'video', video.id, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button 
                              className="reorder-btn down"
                              onClick={() => handleResourceReorder(subject.id, 'video', video.id, 'down')}
                              disabled={index === (subject.videoLectures.length - 1)}
                              title="Move Down"
                            >
                              ↓
                            </button>
                          </div>
                          <button 
                            className="edit-btn" 
                            onClick={() => openEditModal(subject.id, 'video', video)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => deleteResourceHandler(subject.id, 'video', video.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No video lectures added yet</p>
                  )}
                </div>
                
                {/* Assignments Section */}
                <div className="subject-assignments">
                  <h5>Assignments</h5>
                  {subject.assignments && subject.assignments.length > 0 ? (
                    subject.assignments.map((assignment, index) => (
                      <div key={assignment.id} className="assignment-item">
                        <span>{assignment.title}</span>
                        <div className="item-actions">
                          {/* Reorder buttons */}
                          <div className="reorder-buttons">
                            <button 
                              className="reorder-btn up"
                              onClick={() => handleResourceReorder(subject.id, 'assignment', assignment.id, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button 
                              className="reorder-btn down"
                              onClick={() => handleResourceReorder(subject.id, 'assignment', assignment.id, 'down')}
                              disabled={index === (subject.assignments.length - 1)}
                              title="Move Down"
                            >
                              ↓
                            </button>
                          </div>
                          <button 
                            className="edit-btn" 
                            onClick={() => openEditModal(subject.id, 'assignment', assignment)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => deleteResourceHandler(subject.id, 'assignment', assignment.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No assignments added yet</p>
                  )}
                </div>
                
                {/* Previous Year Questions Section */}
                <div className="subject-pyq">
                  <h5>Previous Year Questions</h5>
                  {subject.previousYearQuestions && subject.previousYearQuestions.length > 0 ? (
                    subject.previousYearQuestions.map((pyq, index) => (
                      <div key={pyq.id} className="pyq-item">
                        <span>{pyq.title || `${pyq.year} ${pyq.semester}`}</span>
                        <div className="item-actions">
                          {/* Reorder buttons */}
                          <div className="reorder-buttons">
                            <button 
                              className="reorder-btn up"
                              onClick={() => handleResourceReorder(subject.id, 'pyq', pyq.id, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button 
                              className="reorder-btn down"
                              onClick={() => handleResourceReorder(subject.id, 'pyq', pyq.id, 'down')}
                              disabled={index === (subject.previousYearQuestions.length - 1)}
                              title="Move Down"
                            >
                              ↓
                            </button>
                          </div>
                          <button 
                            className="edit-btn" 
                            onClick={() => openEditModal(subject.id, 'pyq', pyq)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => deleteResourceHandler(subject.id, 'pyq', pyq.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No previous year questions added yet</p>
                  )}
                </div>
                </div>
        ))
      ) : (
        <p>No subjects added for this semester yet</p>
      );
    })()}
  </div>
))}
    </div>
  </div>
)}
          
        </div>
      </div>
      {editModalOpen && <EditResourceModal />}
      {/* Add this right before the final closing </div> tag */}
{editSubjectModalOpen && (
  <div className="modal-overlay">
    <div className="edit-modal">
      <div className="edit-modal-header">
        <h3>Edit Subject</h3>
        <button className="close-modal-btn" onClick={closeEditSubjectModal}>×</button>
      </div>
      
      <div className="edit-modal-body">
        <div className="form-group">
          <label>Subject Name</label>
          <input 
            type="text" 
            value={editSubject?.name || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditSubject(prev => ({...prev, name:newValue}));
            }}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Subject Code</label>
          <input 
            type="text" 
            value={editSubject?.code || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditSubject(prev => ({...prev, name:newValue}));
            }}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Subject Icon (Emoji)</label>
          <input 
            type="text" 
            value={editSubject?.icon || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditSubject(prev => ({...prev, name:newValue}));
            }}
            maxLength="2"
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={editSubject?.description || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditSubject(prev => ({...prev, name:newValue}));
            }}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Instructor</label>
          <input 
            type="text" 
            value={editSubject?.instructor || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditSubject(prev => ({...prev, name:newValue}));
            }}
          />
        </div>
        
        <div className="form-group">
          <label>Credits</label>
          <input 
            type="number" 
            value={editSubject?.credits || 0}
            onChange={(e) => {
  const newValue = e.target.value;
  setEditSubject(prev => ({...prev, name:newValue}));
}}
            max="6"
          />
        </div>
        
        <div className="form-group">
          <label>Semester</label>
          <select 
            value={editSubject?.semesterId || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditSubject(prev => ({...prev, name:newValue}));
            }}
            required
          >
            {semesters.map(sem => (
              <option key={sem.id} value={sem.id}>
                {sem.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Syllabus URL (Google Drive)</label>
          <input 
            type="url" 
            value={editSubject?.syllabusUrl || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditSubject(prev => ({...prev, name:newValue}));
            }}
            placeholder="https://drive.google.com/file/d/..."
          />
        </div>
      </div>
      
      <div className="edit-modal-footer">
        <button className="cancel-btn" onClick={closeEditSubjectModal}>Cancel</button>
        <button className="save-btn" onClick={saveSubjectEdit}>Save Changes</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminPortal;