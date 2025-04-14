// src/components/Footer.jsx
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
              <a href="#" className="social-link">
                <i className="social-icon facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="social-icon twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="social-icon instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="social-icon linkedin"></i>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="#semesters">Semesters</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Study Materials</a></li>
              <li><a href="#">Video Lectures</a></li>
              <li><a href="#">Assignments</a></li>
              <li><a href="#">AI Learning Assistant</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p className="contact-info"><i className="contact-icon email"></i> support@collegehelper.com</p>
            <p className="contact-info"><i className="contact-icon phone"></i> +1 (555) 123-4567</p>
            <p className="contact-info"><i className="contact-icon location"></i> 123 Education Ave, Learning City, CA 94105</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} College Helper. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;