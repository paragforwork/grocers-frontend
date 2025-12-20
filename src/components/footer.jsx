import React from 'react';
import './footer.css'; // The CSS file for styling

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Column 1: About Us */}
        <div className="footer-column">
          <h4>About Us</h4>
          <p>
            We are your friendly neighborhood grocery app, dedicated to bringing fresh produce and daily essentials directly from local sellers to your home in Jalandhar.
          </p>
        </div>

        {/* Column 2: Contact Us */}
        <div className="footer-column">
          <h4>Contact Us</h4>
          <p>
            East Durgapur ,Kailashahar<br />
           Tripura, India<br />
            <strong>Phone:</strong> +91 12345 67890<br />
            <strong>Email:</strong> support@grocersapp.com
          </p>
        </div>

        {/* Column 3: Follow Us */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <ul className="social-links">
            <li><a href="https://facebook.com">Facebook</a></li>
            <li><a href="https://instagram.com">Instagram</a></li>
            <li><a href="https://twitter.com">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom-bar">
        <p>&copy; {new Date().getFullYear()} Grocers App. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;