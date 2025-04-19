// src/components/Footer.jsx
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Helper function to create correct links based on current page
  const getLink = (sectionId) => {
    if (isHomePage) {
      // If on home page, use hash navigation
      return `#${sectionId}`;
    } else {
      // If not on home page, link back to home with hash
      return `/#${sectionId}`;
    }
  };

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
              <a href="https://www.instagram.com/i_am_akshat2004/" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="social-icon instagram"></i>
              </a>
              <a href="www.linkedin.com/in/akshat-baranwal04" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="social-icon linkedin"></i>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to={getLink("semesters")}>Semesters</Link>
              </li>
              <li>
                <Link to={getLink("features")}>Features</Link>
              </li>
              <li>
                <Link to={getLink("about")}>About Us</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><Link to={getLink("semesters")}>Study Materials</Link></li>
              <li><Link to={getLink("semesters")}>Video Lectures</Link></li>
              <li><Link to={getLink("semesters")}>Assignments</Link></li>
              <li><Link to={getLink("semesters")}>AI Learning Assistant</Link></li>
              <li><Link to={getLink("faq")}>FAQs</Link></li>
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