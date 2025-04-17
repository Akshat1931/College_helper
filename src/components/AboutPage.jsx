// src/components/AboutPage.jsx
import React from 'react';
import './AboutPage.css';

function AboutPage() {
  const achievements = [
    {
      title: "Hackathon Winner",
      description: "First Place at Hacknight'25",
      icon: "🏆",
      date: "March 2025"
    },
    {
      title: "1st runner-up",
      description: "1st runner up at Hackz'24 by Temenos",
      icon: "🎉",
      date: "November 2024"
    },
    {
      title: "2nd runner-up",
      description: "3rd place at hack of duty",
      icon: "💻",
      date: "October 2024"
    }
  ];

  const skills = [
    'React', 'JavaScript', 'Python', 
    'Node.js', 'MongoDB', 'HTML/CSS', 
    'TailwindCSS', 'Git', 'TypeScript',
    'Solidity', 'Golang', 'Java',
    'C++', 'AI/ML'
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <div className="profile-section centered">
            <div className="profile-image-container">
              <img 
                src="https://media-hosting.imagekit.io/61019d26888d41e7/WhatsApp%20Image%202025-04-15%20at%2003.50.08_26c65583.jpg?Expires=1839279654&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=czESavPdj--JVSPH5X761UDt50cK9XIntWfasC2JP2Wmdm-aeDViDahu3l9q~~p1SD5-Sj13FOdNMBH0AMSWflmt0I1qvnFc2yZUHPiPV0ubPPMiPshXKwWSetEbmrLGWaFAkqh~TOWWKFa2lCsPNNGsDDw0cdbKYWY6IBgXQUctJm20VihI-2iQTR4dW2loiUOovxjkuEAdp85J3jYI~4muSf12MhvNP7nZ4dRgODhRQxXIvSC63HAsM9rZrOLH~WDynHbyFBz6sIywI7Yj358yV4KHkDN-CH0ReZE3Jy6EMvpmFhNnGMVXpBso6fduwfpGsA~hpOZ1lYIOOt8vpw__" 
                alt="Akshat Baranwal" 
                className="profile-image"
              />
              <div className="profile-overlay">
                <div className="social-links">
                  <a href="https://www.linkedin.com/in/akshat-baranwal04/" target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="social-icon linkedin"></i>
                  </a>
                  <a href="https://github.com/akshat1931" target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="social-icon github"></i>
                  </a>
                  <a href="https://www.instagram.com/i_am_akshat2004/" target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="social-icon instagram"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="profile-info">
              <h1>Akshat Baranwal</h1>
              <p className="subtitle">
                Computer Science Engineering Student | Full Stack Developer | Tech Enthusiast
              </p>
            </div>
          </div>
            
          <div className="content-section">
            <div className="about-details">
              <div className="detail-card">
                <div className="detail-icon">🎓</div>
                <div className="detail-content">
                  <h4>Education</h4>
                  <p>B.Tech in Computer Science Engineering</p>
                  <span>SRM Institute of Science and Technology, KTR Campus</span>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-icon">📍</div>
                <div className="detail-content">
                  <h4>Current Year</h4>
                  <p>Second Year</p>
                  <span>Full-time Student</span>
                </div>
              </div>
            </div>
            
            <div className="skills-section">
              <h3>Tech Stack</h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            
            <div className="achievements-section">
              <h3>Recent Achievements</h3>
              <div className="achievements-grid">
                {achievements.map((achievement, index) => (
                  <div key={index} className="achievement-card">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-content">
                      <h4>{achievement.title}</h4>
                      <p>{achievement.description}</p>
                      <span className="achievement-date">{achievement.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="cta-wrapper">
              <div className="cta-section">
                <a 
                  href="https://drive.google.com/file/d/1Gh7oZs9Qet9ptDeunBC4MtRwIrwGiVk9/view?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cta-button resume-btn"
                >
                  <span className="cta-icon">📄</span>
                  <span>Download Resume</span>
                </a>
                <a href="#" className="cta-button contact-btn">
                  <span className="cta-icon">✉️</span>
                  <span>Contact Me</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="about-story-section">
        <div className="container">
          <div className="story-content">
            <h2>My Journey</h2>
            <p>
              As a passionate Computer Science student at SRM KTR, I'm dedicated to exploring 
              the vast world of technology. My journey is driven by curiosity, continuous learning, 
              and a desire to create innovative solutions that make a difference.
            </p>
            
            <div className="journey-highlights">
              <div className="highlight-card">
                <div className="highlight-icon">💻</div>
                <h4>Web Development</h4>
                <p>Building responsive and intuitive web applications</p>
              </div>
              
              <div className="highlight-card">
                <div className="highlight-icon">🤖</div>
                <h4>AI & Machine Learning</h4>
                <p>Exploring intelligent systems and algorithms</p>
              </div>
              
              <div className="highlight-card">
                <div className="highlight-icon">🚀</div>
                <h4>Innovation</h4>
                <p>Transforming ideas into impactful technological solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
    </div>
  );
}

export default AboutPage;