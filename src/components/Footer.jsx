// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>College Helper</h3>
            <p>Your comprehensive study resource for all semesters and subjects. Making college life easier since 2025.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="social-icon facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="social-icon twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="social-icon instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="social-icon linkedin"></i>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
<ul>
  <li>
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }}
    >
      Home
    </a>
  </li>
  <li><a href="#semesters" onClick={(e) => {
    e.preventDefault();
    document.getElementById('semesters')?.scrollIntoView({behavior: 'smooth'});
  }}>Semesters</a></li>
  <li><a href="#features" onClick={(e) => {
    e.preventDefault();
    document.getElementById('features')?.scrollIntoView({behavior: 'smooth'});
  }}>Features</a></li>
  <li><a href="#about" onClick={(e) => {
    e.preventDefault();
    document.getElementById('about')?.scrollIntoView({behavior: 'smooth'});
  }}>About Us</a></li>
</ul>
          </div>
          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><Link to="/#semesters">Study Materials</Link></li>
              <li><Link to="/#semesters">Video Lectures</Link></li>
              <li><Link to="/#semesters">Assignments</Link></li>
              <li><Link to="/#semesters">AI Learning Assistant</Link></li>
              <li><a href="#faq" onClick={(e) => {
                e.preventDefault();
                document.getElementById('faq')?.scrollIntoView({behavior: 'smooth'});
              }}>FAQs</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p className="contact-info"><i className="contact-icon email"></i> akshatvaidik@gmail.com</p>
            <p className="contact-info"><i className="contact-icon phone"></i> N/A</p>
            <p className="contact-info"><i className="contact-icon location"></i> SRM University, Samundeeswari Nagar, Potheri, Chennai, Tamil Nadu 603203</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} College Helper. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;