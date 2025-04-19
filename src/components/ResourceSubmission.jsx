import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getAllSemesters, getSubjectsBySemester } from '../firebase/dataService';
import { submitResource } from '../firebase/submissionService';
import './ResourceSubmission.css';

function ResourceSubmission() {
  const { isLoggedIn, userProfile } = useUser();
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    semesterId: '',
    subjectId: '',
    resourceType: 'chapter',
    title: '',
    description: '',
    url: '',
    // Completely remove file field
  });

  // Load semesters and subjects
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load semesters
        const semesterData = await getAllSemesters();
        setSemesters(semesterData);
        
        // If first semester exists, load its subjects by default
        if (semesterData.length > 0) {
          const firstSemSubjects = await getSubjectsBySemester(semesterData[0].id);
          setSubjects(firstSemSubjects);
        }
      } catch (error) {
        console.error("Error loading semesters/subjects:", error);
        setError("Failed to load semesters. Please try again later.");
      }
    };

    loadData();
  }, []);

  // When semester changes, load corresponding subjects
  const handleSemesterChange = async (e) => {
    const semesterId = e.target.value;
    setFormData(prev => ({
      ...prev, 
      semesterId, 
      subjectId: '' // Reset subject when semester changes
    }));

    try {
      const semesterSubjects = await getSubjectsBySemester(semesterId);
      setSubjects(semesterSubjects);
    } catch (error) {
      console.error("Error loading subjects for semester:", error);
      setError("Failed to load subjects for selected semester.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate inputs
    if (!formData.semesterId) {
      setError("Please select a semester.");
      setLoading(false);
      return;
    }

    if (!formData.subjectId) {
      setError("Please select a subject.");
      setLoading(false);
      return;
    }

    if (!isLoggedIn) {
      setError("You must be logged in to submit resources.");
      setLoading(false);
      return;
    }

    try {
      // Add user info to the submission
      const submission = {
        ...formData,
        userId: userProfile.id,
        userName: userProfile.name || userProfile.fullName,
        userEmail: userProfile.email,
        submittedAt: new Date(),
        status: 'pending'
      };

      // Submit the resource
      await submitResource(submission);
      
      // Reset form on success
      setFormData({
        semesterId: '',
        subjectId: '',
        resourceType: 'chapter',
        title: '',
        description: '',
        url: ''
      });
      
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting resource:", error);
      setError("Failed to submit resource. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resource-submission">
      <div className="submission-header">
        <h2>Submit a Resource</h2>
        <p>Share your knowledge with your peers! Submit study materials, notes, or links for review.</p>
      </div>

      {!isLoggedIn ? (
        <div className="login-notice">
          <p>Please log in to submit resources.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="submission-form">
          {success && (
            <div className="success-message">
              Resource submitted successfully! It will be reviewed by an admin before being published.
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="semester">Semester</label>
              <select 
                id="semester" 
                name="semesterId" 
                value={formData.semesterId} 
                onChange={handleSemesterChange}
                required
              >
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select 
                id="subject" 
                name="subjectId" 
                value={formData.subjectId} 
                onChange={handleInputChange}
                required
                disabled={!formData.semesterId}
              >
                <option value="">
                  {formData.semesterId 
                    ? 'Select Subject' 
                    : 'Select Semester First'}
                </option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} {subject.code ? `(${subject.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="resourceType">Resource Type</label>
            <select 
              id="resourceType" 
              name="resourceType" 
              value={formData.resourceType} 
              onChange={handleInputChange}
              required
            >
              <option value="chapter">Chapter / Notes</option>
              <option value="video">Video Lecture</option>
              <option value="pyq">Previous Year Question</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">
              {formData.resourceType === 'pyq' 
                ? 'Year & Semester' 
                : 'Resource Title'}
            </label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange}
              placeholder={formData.resourceType === 'pyq' 
                ? 'e.g., 2023 End-Sem' 
                : 'Enter resource title'}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange}
              placeholder="Briefly describe this resource..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">
              {formData.resourceType === 'video' 
                ? 'YouTube Video URL' 
                : 'Google Drive or Resource URL'}
            </label>
            <input 
              type="url" 
              id="url" 
              name="url" 
              value={formData.url} 
              onChange={handleInputChange}
              placeholder={formData.resourceType === 'video' 
                ? 'https://www.youtube.com/watch?v=...' 
                : 'https://drive.google.com/file/d/...'}
              required
            />
            <span className="form-hint">
              {formData.resourceType === 'video' 
                ? 'Please provide a YouTube video link' 
                : 'Preferably a Google Drive link that anyone can view'}
            </span>
          </div>

          <div className="submission-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Resource'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ResourceSubmission;