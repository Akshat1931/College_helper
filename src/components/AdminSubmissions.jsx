// src/components/AdminSubmissions.jsx
import React, { useState, useEffect } from 'react';
import { 
  getPendingSubmissions, 
  approveSubmission, 
  rejectSubmission,
  deleteSubmission
} from '../firebase/submissionService';
import { getSubjectsBySemester } from '../firebase/dataService';

function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [subjectsByCategory, setSubjectsByCategory] = useState({});
  const [processing, setProcessing] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch all pending submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
        try {
          setLoading(true);
          const pendingSubmissions = await getPendingSubmissions();
          setSubmissions(pendingSubmissions);
          
          // Prepare subject lookup by semester
          const semesters = [...new Set(pendingSubmissions.map(s => s.semesterId))];
          const subjectLookup = {};
          
          for (const semId of semesters) {
            if (semId) {
              const semesterSubjects = await getSubjectsBySemester(semId);
              subjectLookup[semId] = semesterSubjects;
            }
          }
          
          setSubjectsByCategory(subjectLookup);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching submissions:", {
            error: err,
            message: err.message,
            stack: err.stack
          });
          setError("Failed to load submissions. Please try again.");
          setLoading(false);
        }
      };
      
      fetchSubmissions();
    }, []);

  // Handle approval of a submission
  const handleApprove = async (submission) => {
    try {
      // Validate subject selection
      if (!submission.subjectId) {
        setMessage({ 
          text: 'Please select a subject before approving the submission', 
          type: 'error' 
        });
        return;
      }
      
      setProcessing(submission.id);
      
      console.log('Approving submission:', {
        submissionId: submission.id,
        subjectId: submission.subjectId,
        resourceType: submission.resourceType
      });
      
      await approveSubmission(submission.id);
      
      // Update the submissions list
      setSubmissions(submissions.filter(s => s.id !== submission.id));
      setMessage({ 
        text: `Resource "${submission.title}" has been approved and added`, 
        type: 'success' 
      });
    } catch (err) {
      console.error("Error approving submission:", {
        error: err,
        submission: submission,
        message: err.message,
        stack: err.stack
      });
      setMessage({ 
        text: `Failed to approve: ${err.message}`, 
        type: 'error' 
      });
    } finally {
      setProcessing(null);
    }
  };

  // Open the reject modal for a submission
  const openRejectModal = (submission) => {
    setSelectedSubmission(submission);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Handle rejection of a submission
  const handleReject = async () => {
    if (!selectedSubmission) return;
    
    try {
      setProcessing(selectedSubmission.id);
      
      await rejectSubmission(selectedSubmission.id, rejectReason);
      
      // Update the submissions list
      setSubmissions(submissions.filter(s => s.id !== selectedSubmission.id));
      setMessage({ 
        text: `Resource "${selectedSubmission.title}" has been rejected`, 
        type: 'success' 
      });
      
      // Close the modal
      setShowRejectModal(false);
      setSelectedSubmission(null);
    } catch (err) {
      console.error("Error rejecting submission:", err);
      setMessage({ 
        text: `Failed to reject: ${err.message}`, 
        type: 'error' 
      });
    } finally {
      setProcessing(null);
    }
  };

  // Handle deletion of a submission
  const handleDelete = async (submission) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this submission "${submission.title}"?`
    );
    
    if (confirmDelete) {
      try {
        setProcessing(submission.id);
        
        await deleteSubmission(submission.id);
        
        // Update the submissions list
        setSubmissions(submissions.filter(s => s.id !== submission.id));
        setMessage({ 
          text: `Submission "${submission.title}" has been deleted`, 
          type: 'success' 
        });
      } catch (err) {
        console.error("Error deleting submission:", err);
        setMessage({ 
          text: `Failed to delete: ${err.message}`, 
          type: 'error' 
        });
      } finally {
        setProcessing(null);
      }
    }
  };

  // Update the subject ID when a subject is selected
  const handleSubjectSelect = (submissionId, subjectId) => {
    // Log the selection for debugging
    console.log('Subject selection:', { 
      submissionId, 
      subjectId, 
      currentSubmissions: submissions 
    });
  
    // Validate inputs
    if (!submissionId || !subjectId) {
      console.error('Invalid submission or subject ID', { submissionId, subjectId });
      return;
    }
  
    setSubmissions(submissions.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            subjectId: subjectId.toString(), // Ensure it's a string
            selectedSubjectName: subjectsByCategory[sub.semesterId]?.find(s => s.id === subjectId)?.name 
          } 
        : sub
    ));
  };

  // Format the date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    // If it's a Firestore timestamp
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    
    // If it's a Date object or string
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="admin-section submissions-section">
      <h2>User Submissions</h2>
      
      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      {error && (
        <div className="admin-message error">
          {error}
        </div>
      )}
      
      {submissions.length === 0 ? (
        <div className="no-submissions">
          <p>No pending submissions to review.</p>
        </div>
      ) : (
        <div className="submissions-list">
          {submissions.map(submission => (
            <div key={submission.id} className="submission-card">
              <div className="submission-header">
                <h3>{submission.title}</h3>
                <span className={`submission-status ${submission.status}`}>
                  {submission.status}
                </span>
              </div>
              
              <div className="submission-details">
                <div className="detail-row">
                  <span className="detail-label">Submitted by:</span>
                  <span className="detail-value">{submission.userName} ({submission.userEmail})</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(submission.submittedAt)}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value resource-type">
                    {submission.resourceType === 'chapter' && 'Chapter / Notes'}
                    {submission.resourceType === 'video' && 'Video Lecture'}
                    {submission.resourceType === 'pyq' && 'Previous Year Question'}
                    {submission.resourceType === 'assignment' && 'Assignment'}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Subject:</span>
                  <span className="detail-value">{submission.subjectName} {submission.subjectCode ? `(${submission.subjectCode})` : ''}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Semester:</span>
                  <span className="detail-value">Semester {submission.semesterId}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <p className="detail-value description">{submission.description}</p>
                </div>
                
                {submission.url && (
                  <div className="detail-row">
                    <span className="detail-label">URL:</span>
                    <a 
                      href={submission.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="detail-value url"
                    >
                      {submission.url}
                    </a>
                  </div>
                )}
                
                {submission.fileURL && (
                  <div className="detail-row">
                    <span className="detail-label">Uploaded File:</span>
                    <a 
                      href={submission.fileURL} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="detail-value url"
                    >
                      View Uploaded File
                    </a>
                  </div>
                )}
                
                <div className="detail-row">
                  <span className="detail-label">Assign to Subject:</span>
                  <select 
                    className="subject-select"
                    value={submission.subjectId || ''}
                    onChange={(e) => handleSubjectSelect(submission.id, e.target.value)}
                    required
                  >
                    <option value="">Select a Subject</option>
                    {subjectsByCategory[submission.semesterId]?.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code || 'No Code'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="submission-actions">
                <button 
                  className="approve-btn" 
                  onClick={() => handleApprove(submission)}
                  disabled={processing === submission.id || !submission.subjectId}
                >
                  {processing === submission.id ? 'Processing...' : 'Approve'}
                </button>
                <button 
                  className="reject-btn" 
                  onClick={() => openRejectModal(submission)}
                  disabled={processing === submission.id}
                >
                  Reject
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(submission)}
                  disabled={processing === submission.id}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Rejection Modal */}
      {showRejectModal && selectedSubmission && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3>Reject Submission</h3>
              <button className="close-modal-btn" onClick={() => setShowRejectModal(false)}>×</button>
            </div>
            
            <div className="edit-modal-body">
              <p>You are about to reject: <strong>{selectedSubmission.title}</strong></p>
              
              <div className="form-group">
                <label htmlFor="rejection-reason">Reason for Rejection (Optional)</label>
                <textarea
                  id="rejection-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide feedback to the submitter..."
                  rows={4}
                ></textarea>
              </div>
            </div>
            
            <div className="edit-modal-footer">
              <button className="cancel-btn" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button 
                className="reject-confirm-btn" 
                onClick={handleReject}
                disabled={processing === selectedSubmission.id}
              >
                {processing === selectedSubmission.id ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSubmissions;