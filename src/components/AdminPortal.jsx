// src/components/AdminPortal.jsx - Updated to use Firebase
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import './AdminPortal.css';

// Import Firebase services
import {
  getAllSubjects,
  getAllSemesters,
  addSubject,
  deleteSubject,
  addChapter,
  addVideoLecture,
  addPreviousYearQuestion,
  addAssignment,
  deleteResourceFromSubject
} from '../firebase/dataService';

const AdminPortal = () => {
  const { userProfile, isLoggedIn, isAdmin, loading } = useUser();
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  useEffect(() => {
    // Wait for auth to be ready
    if (loading) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load semesters
        const semesterList = await getAllSemesters();
        setSemesters(semesterList);
        
        // Load subjects
        const allSubjects = await getAllSubjects();
        setSubjects(allSubjects);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading admin data:", error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [loading]);
  
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
  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    
    if (!newResource.subjectId) {
      alert('Please select a subject');
      return;
    }
    
    try {
      setIsLoading(true);
      
      let updatedSubject;
      
      // Add different resource types
      switch(newResource.type) {
        case 'video':
          updatedSubject = await addVideoLecture(newResource.subjectId, {
            title: newResource.title,
            description: newResource.description,
            url: newResource.url,
            iframe: `<iframe width="1057" height="595" src="${newResource.url}" title="${newResource.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
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
      
      // Update the subjects array with the updated subject
      const updatedSubjects = subjects.map(subject => 
        subject.id === newResource.subjectId ? updatedSubject : subject
      );
      
      setSubjects(updatedSubjects);
      
      // Reset form but keep the selected subject and semester
      setNewResource({
        title: '',
        type: newResource.type,
        url: '',
        description: '',
        subjectId: newResource.subjectId,
        semesterId: newResource.semesterId
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding resource:", error);
      alert("Failed to add resource. Please try again.");
      setIsLoading(false);
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
        </div>
        
        <div className="admin-content">
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
                    onChange={e => setNewChapter({...newChapter, driveEmbedUrl: e.target.value})}
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
                    onChange={e => setNewResource({...newResource, url: e.target.value})}
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
                    {getSubjectsBySemester(semester.id).length > 0 ? (
                      getSubjectsBySemester(semester.id).map(subject => (
                        <div key={subject.id} className="subject-item">
                          <div className="subject-item-header">
                            <h4>{subject.name} ({subject.code})</h4>
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
                              subject.chapters.map(chapter => (
                                <div key={chapter.id} className="chapter-item">
                                  <span>{chapter.title}</span>
                                  <button 
                                    className="delete-btn" 
                                    onClick={() => deleteResourceHandler(subject.id, 'chapter', chapter.id)}
                                  >
                                    Delete
                                  </button>
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
                              subject.videoLectures.map(video => (
                                <div key={video.id} className="video-item">
                                  <span>{video.title}</span>
                                  <button 
                                    className="delete-btn" 
                                    onClick={() => deleteResourceHandler(subject.id, 'video', video.id)}
                                  >
                                    Delete
                                  </button>
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
                              subject.assignments.map(assignment => (
                                <div key={assignment.id} className="assignment-item">
                                  <span>{assignment.title}</span>
                                  <button 
                                    className="delete-btn" 
                                    onClick={() => deleteResourceHandler(subject.id, 'assignment', assignment.id)}
                                  >
                                    Delete
                                  </button>
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
                              subject.previousYearQuestions.map(pyq => (
                                <div key={pyq.id} className="pyq-item">
                                  <span>{pyq.title || `${pyq.year} ${pyq.semester}`}</span>
                                  <button 
                                    className="delete-btn" 
                                    onClick={() => deleteResourceHandler(subject.id, 'pyq', pyq.id)}
                                  >
                                    Delete
                                  </button>
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
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;