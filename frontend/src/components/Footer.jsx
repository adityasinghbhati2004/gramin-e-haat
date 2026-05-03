import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="navbar-brand" style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '1.5rem' }}>🌾</span>
              Gramin E-Haat
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              Promoting rural handmade products across India. Discover unique, authentic items directly from artisans.
            </p>
          </div>
          
          <div>
            <h3 className="footer-title">Categories</h3>
            <ul className="footer-links">
              <li><Link to="/categories?cat=Handicrafts">Handicrafts</Link></li>
              <li><Link to="/categories?cat=Pottery">Pottery</Link></li>
              <li><Link to="/categories?cat=Handloom">Handloom</Link></li>
              <li><Link to="/categories?cat=Jewelry">Jewelry</Link></li>
              <li><Link to="/categories?cat=Art">Art & Paintings</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="footer-title">Customer Service</h3>
            <ul className="footer-links">
              <li><Link to="/dashboard">My Account</Link></li>
              <li><Link to="/dashboard">Track Order</Link></li>
              <li><Link to="/dashboard">Returns & Refunds</Link></li>
              <li><Link to="/dashboard">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Connect With Us</h3>
            <ul className="footer-links">
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Gramin E-Haat Bazaar. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
