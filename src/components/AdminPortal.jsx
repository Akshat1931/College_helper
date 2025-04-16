import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import './AdminPortal.css';

const AdminPortal = () => {
  const { userProfile, isLoggedIn } = useUser();
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Update this with your actual Google login email
  const adminUsers = ['admin@example.com', 'discordakshat04@gmail.com', 'akshat.baranwal@srmist.edu.in'];
  const [isAdmin, setIsAdmin] = useState(false);
  
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

  // Check if current user is admin - modified to be less strict
  useEffect(() => {
    if (isLoggedIn && userProfile && userProfile.email) {
      // Debug logs - useful for troubleshooting
      console.log("Current user:", userProfile);
      console.log("User email:", userProfile.email);
      console.log("Admin emails:", adminUsers);
      
      // Case-insensitive check
      const userEmail = userProfile.email.toLowerCase();
      const isUserAdmin = adminUsers.some(email => email.toLowerCase() === userEmail);
      console.log("Is admin check result:", isUserAdmin);
      
      setIsAdmin(isUserAdmin);
    } else {
      setIsAdmin(false);
    }
  }, [userProfile, isLoggedIn, adminUsers]);

  // Force admin access for testing if needed
  // Uncomment this block if you still have issues
  /*
  useEffect(() => {
    setIsAdmin(true);
    console.log("Forcing admin access for testing");
  }, []);
  */

  // Fetch data (In a real app, this would be from your backend)
  useEffect(() => {
    // Simulate API call to get subjects and semesters
    setTimeout(() => {
      // For demo, we'll use local storage
      const storedSubjects = localStorage.getItem('adminSubjects');
      if (storedSubjects) {
        setSubjects(JSON.parse(storedSubjects));
      }
      
      // Create semester structure if not exists
      const semesterList = [];
      for (let i = 1; i <= 8; i++) {
        semesterList.push({
          id: i,
          name: `Semester ${i}`,
          description: `Resources for Semester ${i}`
        });
      }
      setSemesters(semesterList);
      setLoading(false);
    }, 1000);
  }, []);

  // Save data
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem('adminSubjects', JSON.stringify(subjects));
    }
  }, [subjects]);

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    const subjectId = Date.now().toString();
    const newSubjectData = {
      ...newSubject,
      id: subjectId,
      chapters: [],
      previousYearQuestions: [],
      assignments: [],
      videoLectures: []
    };
    
    setSubjects([...subjects, newSubjectData]);
    setNewSubject({
      name: '',
      code: '',
      description: '',
      instructor: '',
      credits: 4,
      semesterId: 1,
      syllabusUrl: ''
    });
  };

  const handleChapterSubmit = (e) => {
    e.preventDefault();
    
    if (!newChapter.subjectId) {
      alert('Please select a subject');
      return;
    }
    
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === newChapter.subjectId) {
        const chapterId = Date.now().toString();
        return {
          ...subject,
          chapters: [...(subject.chapters || []), {
            id: chapterId,
            title: newChapter.title,
            description: newChapter.description,
            driveEmbedUrl: newChapter.driveEmbedUrl
          }]
        };
      }
      return subject;
    });
    
    setSubjects(updatedSubjects);
    setNewChapter({
      title: '',
      description: '',
      driveEmbedUrl: '',
      subjectId: newChapter.subjectId,
      semesterId: newChapter.semesterId
    });
  };

  const handleResourceSubmit = (e) => {
    e.preventDefault();
    
    if (!newResource.subjectId) {
      alert('Please select a subject');
      return;
    }
    
    const resourceId = Date.now().toString();
    const resourceItem = {
      id: resourceId,
      title: newResource.title,
      description: newResource.description,
      url: newResource.url
    };
    
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === newResource.subjectId) {
        if (newResource.type === 'video') {
          return {
            ...subject,
            videoLectures: [...(subject.videoLectures || []), {
              ...resourceItem,
              iframe: `<iframe width="1057" height="595" src="${newResource.url}" title="${newResource.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
            }]
          };
        } else if (newResource.type === 'pyq') {
          return {
            ...subject,
            previousYearQuestions: [...(subject.previousYearQuestions || []), {
              ...resourceItem,
              year: newResource.title.split(' ')[0] || 'Unknown',
              semester: 'End-sem',
              type: 'all units',
              fileUrl: newResource.url
            }]
          };
        } else if (newResource.type === 'assignment') {
          return {
            ...subject,
            assignments: [...(subject.assignments || []), {
              ...resourceItem,
              deadline: 'TBD',
              fileUrl: newResource.url
            }]
          };
        }
      }
      return subject;
    });
    
    setSubjects(updatedSubjects);
    setNewResource({
      title: '',
      type: 'video',
      url: '',
      description: '',
      subjectId: newResource.subjectId,
      semesterId: newResource.semesterId
    });
  };

  // Filter subjects by semester
  const getSubjectsBySemester = (semId) => {
    return subjects.filter(subject => subject.semesterId === semId);
  };

  if (loading) {
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
                <select 
                  className="semester-select"
                  onChange={(e) => {
                    document.getElementById(`semester-${e.target.value}`).scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <option value="">Jump to Semester</option>
                  {semesters.map(sem => (
                    <option key={sem.id} value={sem.id}>
                      {sem.name}
                    </option>
                  ))}
                </select>
                
                {semesters.map(semester => (
                  <div key={semester.id} id={`semester-${semester.id}`} className="semester-data">
                    <h3>{semester.name}</h3>
                    {getSubjectsBySemester(semester.id).length === 0 ? (
                      <p className="no-data">No subjects added for this semester yet.</p>
                    ) : (
                      <div className="subjects-list">
                        {getSubjectsBySemester(semester.id).map(subject => (
                          <div key={subject.id} className="subject-item">
                            <div className="subject-item-header">
                              <h4>{subject.name} ({subject.code})</h4>
                              <span className="subject-meta">{subject.credits} Credits | {subject.instructor}</span>
                            </div>
                            <p className="subject-description">{subject.description}</p>
                            
                            <div className="subject-resources">
                              <div className="resource-counts">
                                <span>Chapters: {subject.chapters?.length || 0}</span>
                                <span>Videos: {subject.videoLectures?.length || 0}</span>
                                <span>PYQs: {subject.previousYearQuestions?.length || 0}</span>
                                <span>Assignments: {subject.assignments?.length || 0}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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