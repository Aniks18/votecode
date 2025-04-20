import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-title">VoteSystem</h3>
            <p className="footer-subtitle">Secure and transparent online voting</p>
          </div>
          
          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} VoteSystem. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;