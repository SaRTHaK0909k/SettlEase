// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";  // Import for Realtime Database
import { getAuth } from "firebase/auth";  // Import for Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB78W78IjDiwFCy5pJYJLV-a6CXLO-47Nk",
  authDomain: "settlease.firebaseapp.com",
  projectId: "settlease",
  storageBucket: "settlease.firebasestorage.app",
  messagingSenderId: "1017368895093",
  appId: "1:1017368895093:web:f7894cc51d01f4906aa23c",
  measurementId: "G-LQ6RHB1BJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const database = getDatabase(app);  // Initialize Realtime Database
const auth = getAuth(app);  // Initialize Authentication

// Export the services to use them in other parts of your app
export { database, auth };
