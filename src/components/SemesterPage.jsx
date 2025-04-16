// src/components/SemesterPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SemesterPage.css';

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
    // Function to load all subject data
    const loadSubjectsData = () => {
      setIsLoading(true);
      
      // Get the built-in subject data
      const builtInSubjects = getBuiltInSubjectsForSemester(semesterNumber);
      
      // Then, check for subjects added through admin portal
      const storedSubjects = localStorage.getItem('adminSubjects');
      let adminSubjects = [];
      
      if (storedSubjects) {
        try {
          const allAdminSubjects = JSON.parse(storedSubjects);
          // Filter to get only subjects for this semester
          adminSubjects = allAdminSubjects.filter(
            subject => subject.semesterId === semesterNumber
          ).map(subject => ({
            ...subject,
            icon: subject.icon || '📚' // Add a default icon if missing
          }));
          console.log(`Found ${adminSubjects.length} admin-added subjects for semester ${semesterNumber}`);
        } catch (error) {
          console.error("Error parsing admin subjects:", error);
        }
      }
      
      // Combine built-in subjects with admin subjects (built-in first)
      const combinedSubjects = [...builtInSubjects, ...adminSubjects];
      setAllSubjects(combinedSubjects);
      
      // Simulate loading delay to match your original behavior
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };
    
    loadSubjectsData();
  }, [semId, semesterNumber]);
  
  // Function to get the built-in subjects for a specific semester
  const getBuiltInSubjectsForSemester = (semNumber) => {
    // Sample data for subjects per semester
    // In a real app, this would come from an API or database
    const subjectsData = {
      1: [
        { id: 1, name: 'Mathematics I', description: 'Calculus and Linear Algebra', icon: '🧮' },
        { id: 2, name: 'Chemistry', description: 'Covers atomic structure, chemical bonding, thermodynamics, and organic reactions essential to material and biological sciences.', icon: '⚛️' },
        { id: 3, name: 'Philosophy Of Engineering', description: 'Explores the ethical, social, and philosophical dimensions of engineering practice.', icon: '🔧' },
        { id: 4, name: 'Introduction To Computational Biology', description: ' An introduction to the fundamentals of computational biology, focusing on data analysis, algorithms, and their applications in biological research.', icon: '📝' },
        { id: 5, name: 'Programming For Problem Solving', description: 'Introduces fundamental programming concepts and problem-solving techniques using structured and procedural programming.', icon: '🖥️' },
        { id: 6, name: 'Foreign Languages', description: 'Basics of spoken and written communication in selected international languages.', icon: '🌍' },
        { id: 7, name: 'Workshop Practice', description: 'Hands-on technical skills', icon: '🔧' },
        { id: 8, name: 'Professional Ethics', description: 'Ethical considerations in professional practice', icon: '⚖️' },
      ],
      // Example data for semester 2
      2: [
        { id: 1, name: 'Mathematics II', description: 'Differential Equations and Statistics', icon: '📊' },
        { id: 2, name: 'Data Structures', description: 'Fundamental data structures and algorithms', icon: '🔍' },
        { id: 3, name: 'Digital Electronics', description: 'Logic gates and digital design', icon: '🔌' },
        { id: 4, name: 'Computer Architecture', description: 'Computer organization and design', icon: '🖥️' },
        { id: 5, name: 'Object-Oriented Programming', description: 'OOP principles and patterns', icon: '🧩' },
        { id: 6, name: 'Discrete Mathematics', description: 'Mathematical structures for computer science', icon: '🔢' },
        { id: 7, name: 'Professional Communication', description: 'Advanced technical communication', icon: '🗣️' },
        { id: 8, name: 'Economics for Engineers', description: 'Basic economic principles', icon: '📈' },
      ],
      // Add similar data for the remaining semesters (3-8)
      3: [
        { id: 1, name: 'Mathematics III', description: 'Advanced calculus and numerical methods', icon: '🔣' },
        { id: 2, name: 'Database Management', description: 'Database concepts and SQL', icon: '🗄️' },
        { id: 3, name: 'Computer Networks', description: 'Network protocols and architecture', icon: '🌐' },
        { id: 4, name: 'Operating Systems', description: 'OS concepts and design', icon: '⚙️' },
        { id: 5, name: 'Theory of Computation', description: 'Automata and formal languages', icon: '🧠' },
        { id: 6, name: 'Web Development', description: 'Frontend and backend technologies', icon: '🌟' },
        { id: 7, name: 'Microprocessors', description: 'Architecture and programming', icon: '💾' },
        { id: 8, name: 'Software Engineering', description: 'Software development lifecycle', icon: '📊' },
      ],
      4: [
        { id: 1, name: 'Artificial Intelligence', description: 'Introduction to AI techniques, including machine learning, neural networks, and natural language processing.', icon: '🤖' },
        { id: 2, name: 'Database Management System', description: 'Database concepts and SQL', icon: '🗄️' },
        { id: 3, name: 'Design and Analysis of Algorithm', description: 'Ways to solve problems optimally', icon: '🖥️' },
        { id: 4, name: 'Probability and Queuing Theory', description: 'Fundamentals of probability theory and queuing models for analyzing systems in operations research and performance optimization.', icon: '⚙️' },
        { id: 5, name: 'Social Engineering', description: 'Study of psychological manipulation techniques used to exploit human behavior and breach security systems.', icon: '🧠' },
        { id: 6, name: 'Universal Human Values', description: 'Focuses on ethics, self-awareness, harmony in relationships, and holistic well-being for personal and societal development.', icon: '🌟' },
        { id: 7, name: 'Design and Analysis of Algorithm (Lab)', description: 'Lab activities', icon: '💾' },
      ],
    };
    
    // For any semester not explicitly defined, generate placeholder subjects
    const subjects = subjectsData[semNumber] || Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Subject ${i + 1}`,
      description: `Description for Subject ${i + 1} in Semester ${semNumber}`,
      icon: ['📘', '📚', '📝', '📓', '📕', '📊', '📱', '💡'][i % 8]
    }));
    
    return subjects;
  };

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
        
        <div className="semester-help">
          <h3>Need Help?</h3>
          <p>Our AI learning assistant is available 24/7 to help with any subject in this semester.</p>
          <button className="ai-help-btn">Ask AI Assistant</button>
        </div>
      </div>
    </div>
  );
}

export default SemesterPage;