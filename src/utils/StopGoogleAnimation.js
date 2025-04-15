// src/utils/StopGoogleAnimation.js

/**
 * This script prevents Google's Sign-In animations that can look bad on mobile
 * It should be imported early in your application
 */

export const initializeGoogleLoginFixes = () => {
    // Create a MutationObserver to watch for Google's popup elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          // Look for Google credential containers
          const googleElements = document.querySelectorAll([
            '#credential_picker_container',
            'iframe[src*="accounts.google.com"]',
            'div[aria-modal="true"]'
          ].join(','));
          
          if (googleElements.length > 0) {
            // Apply styles to prevent animations
            googleElements.forEach(el => {
              el.style.animation = 'none';
              el.style.transition = 'none';
              el.style.transform = 'none';
              
              // Apply to children as well
              const children = el.querySelectorAll('*');
              children.forEach(child => {
                child.style.animation = 'none';
                child.style.transition = 'none';
                child.style.transform = 'none';
              });
            });
          }
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Add a style tag to the head with high specificity
    const style = document.createElement('style');
    style.innerHTML = `
      /* Prevent animations in Google's Sign In elements */
      #credential_picker_container,
      #credential_picker_iframe,
      div[aria-modal="true"],
      div[aria-modal="true"] > div,
      div[aria-modal="true"] > div > div,
      div[aria-modal="true"] > div > div > div,
      .nsm7Bb-HzV7m-LgbsSe,
      .nsm7Bb-HzV7m-LgbsSe * {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }
      
      /* Position the container properly */
      #credential_picker_container {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        height: auto !important;
        max-height: 90vh !important;
        overflow: auto !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
      }
    `;
    document.head.appendChild(style);
    
    // Prevent default Google One Tap behavior
    window.onGoogleLibraryLoad = () => {
      // Disable One Tap completely
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
        
        // Override the Google prompt function to prevent animations
        const originalPrompt = window.google.accounts.id.prompt;
        window.google.accounts.id.prompt = (callback) => {
          document.body.style.overflow = 'hidden'; // Prevent scrolling
          originalPrompt(callback);
        };
      }
    };
    
    return () => {
      // Cleanup function
      observer.disconnect();
    };
  };
  
  export default initializeGoogleLoginFixes;