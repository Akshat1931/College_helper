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
      name: "Akshit Bhatt",
      role: "Computer Science, Year 2",
      imageUrl: "https://media-hosting.imagekit.io/64383d363b0e433f/screenshot_1744779242688.png?Expires=1839387246&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=QSsAqJsrHHUqKJ9X6yhC9I5vaY~aRzx8WH80R4vX5WOaBL07xmFGjuNsEN9uGx702cbth4hmeBkrJZum10064Vj6x0MGznMV1qbB-PkyBAZwQBbRgcdTgFJS6tDEslDhgrgunBpK88wD3SywAtcL2ICV83ix1YjfQ5RmZzya0ANYxfTQI4qL5G0JTNVv5tXAKzuF9r0ObTICTt-9iq~7cM4ybr1K~ZIzVyRVfvSfKge7cjXkxx-HB~HV69ZswVEwFh73xEf3NXItpYvl4P5kb~aIqbklQAA0yoMB9t78i4Up1~BkfMVBZ6dTmE1fyoHn8Jo-LdRom7D-Zv7I0y~rhw__"
    },
    {
      quote: "The AI assistant helped me understand complex concepts I was struggling with. It feels like having a tutor available 24/7!",
      name: "Aryan Awashthi",
      role: "Computer Science, Year 2",
      imageUrl: "https://media-hosting.imagekit.io/865fc088fc58415e/WhatsApp%20Image%202025-04-16%20at%2010.05.46_9d0c14d2.jpg?Expires=1839387114&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=KLUJR9Sxj-huUAsv9rFrkyuPffekrDg6b-3WAegtd2Ff8ezyV~3j6aPheLX77C5dmFSTg5NSLM3JjX86-3TxZE7Z43M0aPrA4zv5FxanJquSSzKqfO2MAexT0Cm0awImrNpNEFblBXbsyER1U0u2obfiDUjOF7txsVaSyC2UrmUHy4uldNJH3Txxg1Za5x5aObEzjat-u8S08SsvUnpTWG0wsMMCQRY2Hk-K4etiV4K0J2850sBFYYwTbO2ELCCSmcJmejGnsPyUUjggRthQEkxTde5IolRkzgD3lY5QakmuxZAWf9XaNnLej7-kBnf8mrbFdGYivuSR2QHU~IZ4xg__"
    },
    {
      quote: "Having all resources in one place saved me hours of searching through emails and drives. The interface is so intuitive!",
      name: "Rishi Puri",
      role: "Computer Science, Year 2",
      imageUrl: "https://media-hosting.imagekit.io/cefa194243384f7c/WhatsApp%20Image%202025-04-16%20at%2010.26.17_1e773a2f.jpg?Expires=1839387398&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ziPYmQ2-5WXzSLaSOqiuoUAuMfSmAF9gP1~0HVp7IpkOK2MUkLWvJE0PSXDhBzHfolXHSoyYkmhziCy4y0w52UB9cKhahqfDfGOAJZE3MtPYC4hj2UBQHAxBb2pVCy7znijJK7G2B8KjlKw1ke0s5cGMv9XSpeI6J2Vxw6A-q2VHndu9r78GvjxjRkK5VWxSn3ZrizTQVj6roOh~ro2GUGPB6sZmlA1iOLpsBkEb-liZTgDZaO3y3pGZDAl8rujTTQAWp918BYPtI6M8zVODFoOq2nzVZDFYdV3s5WjRv2FqKKq2KoDdO0gLwdV4nkBec3PY076HpD~-61DMsnOdDA__"
    },
    {
      quote: "The video lectures and practice quizzes made exam preparation so much easier. I'm recommending this to all my classmates.",
      name: "Shivanshu Sinha",
      role: "Computer Science, Year 2",
      imageUrl: "https://media-hosting.imagekit.io/13e69e44d22343d2/screenshot_1744779291680.png?Expires=1839387295&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=1OL4ypBxtfcrPQxfAkbhi2YvyMf2Qf8ZPlR2BJzCzBNVnkvGHMoxncWM9Og-d8kEynz8221BIiIJ0rLylUVjLpWfMJ5k13lOidGiKQkJv3mUueq0Rog8Sdm1DDEklTvj~cc3859m78iU6cir8kgg7NjBMJDnD5k7zopKKsJs5hKcFDd7Blld0dUpymmrMXpXMNywkw8AJviQkYpe4duJFekfuv7HyrNqGEdtD2FE6PD3qDPaB~fuJuc5P6YxzwjECphm4pmoNbW3JY~6NEOZs2xuLQOHofhBf~GdHKrF9q9Bi6dQZys3x8Rn31kMuJ5XUO8B9tTJJD13aTz2yQt33w__"
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
                    style={{backgroundImage: `url(${testimonial.imageUrl})`}}
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