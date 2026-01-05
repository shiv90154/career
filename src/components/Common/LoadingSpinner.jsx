import React from 'react';
//  

const LoadingSpinner = ({ fullScreen = false, small = false }) => {
  return (
    <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className={`spinner ${small ? 'small' : ''}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-text">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;