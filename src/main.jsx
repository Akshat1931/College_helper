// src/main.jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Import the Google animation fix CSS first
import './styles/DisableGoogleAnimations.css';
import './index.css';
import './App.css';

// Import network error handling
import { showNetworkErrorNotification } from './utils/networkErrorHandler.jsx';


// Add global listener to prevent animations
document.addEventListener('DOMContentLoaded', () => {
  // Inject inline styles to prevent Google animations
  const style = document.createElement('style');
  style.innerHTML = `
    /* Disable all animations for Google elements */
    #credential_picker_container, 
    div[aria-modal="true"],
    div[role="dialog"],
    .nsm7Bb-HzV7m-LgbsSe,
    .S9gUrf-YoZ4jf,
    .g3VIld-ZJ5Gmb {
      animation: none !important;
      transition: none !important;
      transform: none !important;
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      margin: 0 !important;
      z-index: 9999 !important;
    }
  `;
  document.head.appendChild(style);
  
  // Set up an observer to catch Google elements as they appear
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if this is a Google dialog
            if (
              node.id === 'credential_picker_container' ||
              node.getAttribute('aria-modal') === 'true' ||
              node.getAttribute('role') === 'dialog' ||
              node.classList.contains('nsm7Bb-HzV7m-LgbsSe') ||
              node.classList.contains('S9gUrf-YoZ4jf') ||
              node.classList.contains('g3VIld-ZJ5Gmb')
            ) {
              // Force center positioning
              node.style.position = 'fixed';
              node.style.top = '50%';
              node.style.left = '50%';
              node.style.transform = 'translate(-50%, -50%)';
              node.style.animation = 'none';
              node.style.transition = 'none';
              node.style.zIndex = '9999';
              
              // Apply to all children recursively
              node.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
                el.style.transform = 'none';
              });
            }
          }
        }
      }
    }
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

window.addEventListener('refreshnetwork', () => {
  if (!navigator.onLine) {
    showNetworkErrorNotification({
      message: 'Still offline. Please check your network connection.'
    });
  }
});

// Keep your existing online/offline listeners
window.addEventListener('online', () => {
  // Remove any existing network error notifications
  const notificationRoot = document.getElementById('network-error-root');
  if (notificationRoot) {
    notificationRoot.remove();
  }
});

window.addEventListener('offline', () => {
  showNetworkErrorNotification({
    message: 'Internet connection lost. Please check your network.'
  });
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);