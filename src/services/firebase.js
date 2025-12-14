// Firebase Configuration
// Your Hallmark Firebase Project Configuration
// Project: hallmark-bdc26

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration for Hallmark project
const firebaseConfig = {
    apiKey: "AIzaSyCns_-lBcCOKZktKxUagt58XJ8A4SwUiAw",
    authDomain: "hallmark-bdc26.firebaseapp.com",
    projectId: "hallmark-bdc26",
    storageBucket: "hallmark-bdc26.firebasestorage.app",
    messagingSenderId: "692701856466",
    appId: "1:692701856466:web:c53bd374cd1ba1e125230b",
    measurementId: "G-V78H5LLZ8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
