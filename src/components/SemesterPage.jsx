// src/components/SemesterPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SemesterPage.css';
import { getSubjectsBySemester } from '../firebase/dataService';
import { getHardCodedSubjects } from '../data/hardCodedSubjects';
import { isNetworkError, showNetworkErrorNotification } from '../utils/networkErrorHandler.jsx';

function SemesterPage() {
  const { semId } = useParams();
  const semesterNumber = parseInt(semId);
  const [isLoading, setIsLoading] = useState(true);
  const [allSubjects, setAllSubjects] = useState([]);
  
  // Sample semester info data
  const semesterInfo = {
    1: {
      title: 'Semester 1 - Foundation',
      description: 'Your first step into higher education. This semester builds the foundation for your entire degree with core subjects that introduce fundamental concepts.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000'
    },
    2: {
      title: 'Semester 2 - Building Blocks',
      description: 'Continue building on your foundation with more specialized knowledge and advanced concepts across core disciplines.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000'
    },
    3: {
      title: 'Semester 3 - Advancing Knowledge',
      description: 'Dive deeper into your field with more specialized courses that prepare you for upper-division study.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000'
    },
    4: {
      title: 'Semester 4 - Professional Development',
      description: 'Begin to focus on application of knowledge and prepare for practical challenges in your field.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000'
    },
    5: {
      title: 'Semester 5 - Specialization',
      description: 'Start your specialization with targeted courses that align with your career interests.',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000'
    },
    6: {
      title: 'Semester 6 - Advanced Applications',
      description: 'Apply your knowledge to complex problems and scenarios relevant to industry needs.',
      image: 'https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?q=80&w=1000'
    },
    7: {
      title: 'Semester 7 - Research & Innovation',
      description: 'Focus on research methodologies and innovative approaches in your field.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000'
    },
    8: {
      title: 'Semester 8 - Capstone & Industry Prep',
      description: 'Complete your capstone project and prepare for transitioning into the workforce.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000'
    }
  };

  useEffect(() => {
    // Function to load subjects data
    const loadSubjectsData = async () => {
      setIsLoading(true); // show spinner at the start
  
      try {
        // Get subjects from Firebase
        const semesterSubjects = await getSubjectsBySemester(semesterNumber);
        setAllSubjects(semesterSubjects); // use fetched data
      } catch (error) {
        console.error("Error loading semester subjects:", error);
  
        // Check if it's a network error
        if (isNetworkError(error)) {
          showNetworkErrorNotification({
            message: 'Unable to load semester subjects. Please check your internet connection.'
          });
        } else {
          alert('Failed to load subjects. Using default data.');
        }
  
        // Always fall back to hard-coded subjects if there's an error
        const hardCodedSubjects = getHardCodedSubjects(semesterNumber);
        setAllSubjects(hardCodedSubjects);
      } finally {
        setIsLoading(false); // ✅ always hide spinner, no matter what
      }
    };
  
    loadSubjectsData();
  }, [semesterNumber]);

  const currentSemInfo = semesterInfo[semesterNumber] || {
    title: `Semester ${semesterNumber}`,
    description: `Resources and materials for all subjects in semester ${semesterNumber}`,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000'
  };

  if (isLoading) {
    return (
      <div className="semester-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading semester content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="semester-page">
      <div className="semester-banner" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${currentSemInfo.image})`}}>
        <div className="container">
          <div className="semester-header">
            <Link to="/" className="back-link">← Back to All Semesters</Link>
            <h1>{currentSemInfo.title}</h1>
            <p className="semester-description">{currentSemInfo.description}</p>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="subjects-overview">
          <div className="subjects-stats">
            <div className="stat-card">
              <h4>{allSubjects.length}</h4>
              <p>Subjects</p>
            </div>
            <div className="stat-card">
              <h4>48+</h4>
              <p>Documents</p>
            </div>
            <div className="stat-card">
              <h4>24+</h4>
              <p>Video Lectures</p>
            </div>
            <div className="stat-card">
              <h4>16+</h4>
              <p>Assignments</p>
            </div>
          </div>
        </div>
        
        <h2 className="subjects-heading">Your Subjects</h2>
        <div className="subjects-grid">
          {allSubjects.map((subject, index) => (
            <Link 
              to={`/semester/${semesterNumber}/subject/${subject.id}`} 
              key={subject.id} 
              className="subject-card"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div className="subject-icon">{subject.icon}</div>
              <h3>{subject.name}</h3>
              <p>{subject.description}</p>
              <span className="view-details">View Materials →</span>
            </Link>
          ))}
        </div>
        
        {/* AI Help section removed from here */}
      </div>
    </div>
  );
}

export default SemesterPage;