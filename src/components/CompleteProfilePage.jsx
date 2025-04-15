import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './CompleteProfilePage.css';

function CompleteProfilePage() {
  const { userProfile, isLoggedIn, updateUserProfile } = useUser();
  const [profileData, setProfileData] = useState({
    fullName: '',
    college: '',
    branch: '',
    year: '',
    bio: ''
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only redirect if not logged in at all
    // No longer redirecting users who are logged in but haven't completed their profile
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    
    // Pre-fill the form with existing user data if available
    if (userProfile) {
      setProfileData({
        fullName: userProfile.fullName || userProfile.name || '',
        college: userProfile.college || '',
        branch: userProfile.branch || '',
        year: userProfile.year || '',
        bio: userProfile.bio || ''
      });
    }
  }, [isLoggedIn, navigate, userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Use the context's updateUserProfile function to update profile
    // This will immediately update the state across the app
    updateUserProfile({
      ...profileData,
      name: profileData.fullName, // Update the displayed name
      isNewUser: false
    });
    
    console.log('Profile Data Saved:', profileData);
    navigate('/'); // Redirect to home after completing profile
  };

  return (
    <div className="complete-profile-page">
      <div className="profile-container">
        <h1>Complete Your Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>College</label>
            <input
              type="text"
              name="college"
              value={profileData.college}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Branch</label>
            <select
              name="branch"
              value={profileData.branch}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science</option>
              <option value="IT">Information Technology</option>
              <option value="ECE">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <select
              name="year"
              value={profileData.year}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
          </div>
          <div className="form-group">
            <label>Bio (Optional)</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">Complete Profile</button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfilePage;