import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-icon">
            <AlertCircle size={80} />
            <div className="error-code">404</div>
          </div>
          
          <div className="error-message">
            <h1>Page Not Found</h1>
            <p>
              The page you are looking for might have been removed, 
              had its name changed, or is temporarily unavailable.
            </p>
          </div>
          
          <div className="search-suggestion">
            <div className="search-box">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="What are you looking for?"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/courses?search=${e.target.value}`;
                  }
                }}
              />
              <button className="search-btn">Search</button>
            </div>
          </div>
          
          <div className="suggested-links">
            <h3>You might be looking for:</h3>
            <div className="links-grid">
              <Link to="/" className="suggested-link">
                <Home size={20} />
                <div>
                  <h4>Home</h4>
                  <p>Go back to homepage</p>
                </div>
              </Link>
              
              <Link to="/courses" className="suggested-link">
                <Home size={20} />
                <div>
                  <h4>Courses</h4>
                  <p>Browse all courses</p>
                </div>
              </Link>
              
              <Link to="/blogs" className="suggested-link">
                <Home size={20} />
                <div>
                  <h4>Blog</h4>
                  <p>Read our latest articles</p>
                </div>
              </Link>
              
              <Link to="/contact" className="suggested-link">
                <Home size={20} />
                <div>
                  <h4>Contact</h4>
                  <p>Get in touch with us</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="action-buttons">
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={20} />
              Go to Homepage
            </Link>
            <Link to="/courses" className="btn btn-outline">
              Browse Courses
            </Link>
          </div>
          
          <div className="help-section">
            <p>Still can't find what you're looking for?</p>
            <Link to="/contact" className="contact-link">
              Contact our support team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;