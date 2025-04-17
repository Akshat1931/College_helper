// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace these values with your own Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyBeEDgxw2d3MIt-Lo91utfixpYgzMi0LVw",
    authDomain: "akshat-f4a68.firebaseapp.com",
    projectId: "akshat-f4a68",
    storageBucket: "akshat-f4a68.firebasestorage.app",
    messagingSenderId: "1039576021277",
    appId: "1:1039576021277:web:b1a0f25cfbe69fabec49f4",
    measurementId: "G-88TKC46ELH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };