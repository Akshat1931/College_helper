// src/utils/networkErrorHandler.js

import ReactDOM from 'react-dom';
import NetworkErrorNotification from '../components/NetworkErrorNotification.jsx';





/**
 * Check if an error is a network-related error
 * @param {Error} error - The error object to check
 * @returns {boolean} - Whether the error is network-related
 */
export const isNetworkError = (error) => {
  // Comprehensive network error detection
  const errorMessage = error.message.toLowerCase();
  const networkErrorKeywords = [
    'network',
    'connection',
    'offline',
    'failed to fetch',
    'no internet',
    'timeout',
    'err_internet_disconnected',
    'net::err_',
    'firestore',
    'connection refused'
  ];

  // Check if any keyword is in the error message
  const hasNetworkKeyword = networkErrorKeywords.some(keyword => 
    errorMessage.includes(keyword)
  );

  // Additional checks for specific error types
  const isNetworkErrorType = 
    error instanceof TypeError && 
    (errorMessage.includes('failed to fetch') || errorMessage.includes('network'));

  return hasNetworkKeyword || isNetworkErrorType;
};

/**
 * Show a network error notification
 * @param {Object} options - Configuration options for the notification
 */
export const showNetworkErrorNotification = (options = {}) => {
  const {
    message = 'Unable to connect. Check your internet connection.',
    onReload
  } = options;

  // Remove any existing network error notifications
  const existingNotification = document.getElementById('network-error-root');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create a new root for the notification
  const notificationRoot = document.createElement('div');
  notificationRoot.id = 'network-error-root';
  document.body.appendChild(notificationRoot);

  // Render the notification
  ReactDOM.render(
    <NetworkErrorNotification 
      message={message}
      onReload={onReload}
    />,
    notificationRoot
  );
};

/**
 * Wrap async functions with network error handling
 * @param {Function} asyncFunction - The async function to wrap
 * @returns {Function} - A wrapped function with network error handling
 */
export const withNetworkErrorHandling = (asyncFunction) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      if (isNetworkError(error)) {
        showNetworkErrorNotification();
      } else {
        // For non-network errors, log to console
        console.error('An unexpected error occurred:', error);
      }
      throw error; // Re-throw to allow further handling if needed
    }
  };
};