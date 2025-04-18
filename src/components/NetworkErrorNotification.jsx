// src/components/NetworkErrorNotification.jsx
import React, { useState, useEffect } from 'react';
import './NetworkErrorNotification.css';

const NetworkErrorNotification = ({ 
  message = 'Unable to connect. Check your internet connection.', 
  onReload 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide after some time if no action is taken
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="network-error-notification">
      <div className="network-error-content">
        <span className="network-error-icon">⚠️</span>
        <span className="network-error-message">{message}</span>
        <div className="network-error-actions">
          <button 
            className="network-error-reload-btn"
            onClick={() => {
              onReload && onReload();
              window.location.reload();
            }}
          >
            Reload
          </button>
          <button 
            className="network-error-close-btn"
            onClick={() => setIsVisible(false)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkErrorNotification;