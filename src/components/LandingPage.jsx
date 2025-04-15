// src/components/LandingPage.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileNotification from './ProfileNotification';
import './LandingPage.css';

function LandingPage() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState({
    features: false,
    semesters: false,
    testimonials: false,
  });

  useEffect(() => {
    // Smooth scroll to sections
    const scrollToSection = (sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Check if there's a hash in the URL
    if (location.hash) {
      const sectionId = location.hash.substring(1); // Remove the '#'
      scrollToSection(sectionId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.observe-section');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [location.hash]);

  const semesters = [
    { id: 1, name: 'Semester 1', description: 'Foundation courses and introduction to core concepts' },
    { id: 2, name: 'Semester 2', description: 'Building on fundamentals and exploring advanced topics' },
    { id: 3, name: 'Semester 3', description: 'Intermediate concepts and specialized knowledge' },
    { id: 4, name: 'Semester 4', description: 'Advanced theories and practical applications' },
    { id: 5, name: 'Semester 5', description: 'Specialized domains and elective courses' },
    { id: 6, name: 'Semester 6', description: 'In-depth study of major subjects' },
    { id: 7, name: 'Semester 7', description: 'Research-oriented courses and project work' },
    { id: 8, name: 'Semester 8', description: 'Capstone projects and industry preparation' },
  ];

  const features = [
    {
      icon: 'feature-icon-1',
      title: 'Organized Content',
      description: 'All study materials neatly arranged by semester and subject for easy access'
    },
    {
      icon: 'feature-icon-2',
      title: 'AI Learning Assistant',
      description: 'Get instant help with complex topics using our advanced AI support system'
    },
    {
      icon: 'feature-icon-3',
      title: 'PDF Resources',
      description: 'Access notes, textbooks, and study guides anywhere, anytime on any device'
    },
    {
      icon: 'feature-icon-4',
      title: 'Video Lectures',
      description: 'Visual learning resources for better understanding of difficult concepts'
    },
    {
      icon: 'feature-icon-5',
      title: 'Practice Quizzes',
      description: 'Test your knowledge with subject-specific quizzes and get instant feedback'
    },
    {
      icon: 'feature-icon-6',
      title: 'Discussion Forums',
      description: 'Connect with peers to discuss coursework and solve problems together'
    }
  ];

  const testimonials = [
    {
      quote: "This app helped me organize my study materials and improved my grades significantly. I wish I'd found it sooner!",
      name: "Sarah Johnson",
      role: "Computer Science, Year 3"
    },
    {
      quote: "The AI assistant helped me understand complex concepts I was struggling with. It feels like having a tutor available 24/7!",
      name: "Michael Chen",
      role: "Electrical Engineering, Year 2"
    },
    {
      quote: "Having all resources in one place saved me hours of searching through emails and drives. The interface is so intuitive!",
      name: "Priya Sharma",
      role: "Biotechnology, Year 4"
    },
    {
      quote: "The video lectures and practice quizzes made exam preparation so much easier. I'm recommending this to all my classmates.",
      name: "James Wilson",
      role: "Mechanical Engineering, Year 3"
    }
  ];

  // Handle section scrolling
  const handleSectionScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-container">
      <section className="hero">
        <div className="container hero-wrapper">
          <div className="hero-content">
            <h1>Your College Journey<br /><span>Simplified</span></h1>
            <p>Comprehensive resources for all semesters at your fingertips</p>
            <div className="hero-cta">
              <button 
                onClick={() => handleSectionScroll('semesters')} 
                className="primary-btn"
              >
                Explore Semesters
              </button>
              <button 
                onClick={() => handleSectionScroll('features')} 
                className="secondary-btn"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-graphics">
            <div className="hero-blob"></div>
            <div className="floating-card card-1">
              <div className="card-icon">📚</div>
              <h4>Study Materials</h4>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🤖</div>
              <h4>AI Support</h4>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">📝</div>
              <h4>Notes & Resources</h4>
            </div>
          </div>
        </div>
      </section>
      
      <section id="features" className={`features-section observe-section ${isVisible.features ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need</h2>
            <p>Your all-inclusive college companion</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{animationDelay: `${index * 0.1}s`}}>
                <div className={`feature-icon ${feature.icon}`}></div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section id="semesters" className={`semesters-section observe-section ${isVisible.semesters ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Select Your Semester</h2>
            <p>Find resources tailored to your current courses</p>
          </div>
          <div className="semester-grid">
            {semesters.map((sem) => (
              <Link 
                to={`/semester/${sem.id}`} 
                key={sem.id} 
                className="semester-card" 
                style={{animationDelay: `${(sem.id - 1) * 0.1}s`}}
              >
                <div className="semester-card-content">
                  <div className="semester-number">{sem.id}</div>
                  <h3>{sem.name}</h3>
                  <p>{sem.description}</p>
                  <span className="explore-link">Explore Subjects →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <section id="testimonials" className={`testimonial-section observe-section ${isVisible.testimonials ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>What Students Say</h2>
            <p>Join thousands of successful students</p>
          </div>
          <div className="testimonial-slider">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card" style={{animationDelay: `${index * 0.15}s`}}>
                <div className="quote">{testimonial.quote}</div>
                <div className="student-info">
                  <div 
                    className="student-avatar" 
                    style={{backgroundImage: `url('https://i.pravatar.cc/150?img=${index + 10}')`}}
                  ></div>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Learning Experience?</h2>
            <p>Join thousands of students who've already simplified their college journey</p>
            <button className="cta-button">Get Started Today</button>
          </div>
          <div className="cta-graphics"></div>
        </div>
      </section>

      <div className="shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
      
      {/* Add the profile notification component */}
      <ProfileNotification />
      </div>
    
  );
}

export default LandingPage;