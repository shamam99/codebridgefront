import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Discover Us</a></li>
          </ul>
          <ul>
            <li><a href="#">Social Media</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Information</h3>
          <p>Email: <a href="mailto:support@codebridge.com">support@codebridge.com</a></p>
          <p>Phone: +966 123456789</p>
          <p>Address: Saudi Arabia, Abha</p>
          <p>Hours: Sunday - Thursday, 9 AM - 5 PM</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2024 Code Bridge All rights reserved.</p>
        <p>
          <a href="#">Terms of Use</a> | <a href="#">Privacy & Cookie Policy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
