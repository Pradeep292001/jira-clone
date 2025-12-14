// Firebase Configuration
// Replace this with your own Firebase project config from https://console.firebase.google.com
// Project Settings -> General -> Your apps -> Web app config

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Demo Firebase configuration (replace with your own)
// To get your config: https://console.firebase.google.com -> Project Settings -> General
const firebaseConfig = {
    apiKey: "AIzaSyDemoKey-ReplaceWithYourOwnFirebaseConfig",
    authDomain: "jira-clone-demo.firebaseapp.com",
    projectId: "jira-clone-demo",
    storageBucket: "jira-clone-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
