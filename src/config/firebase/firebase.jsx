
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA0IY0K7RPM9HCax3T4cLbo-wqdUAiVdHs",
    authDomain: "notesapp-fcb0f.firebaseapp.com",
    projectId: "notesapp-fcb0f",
    storageBucket: "notesapp-fcb0f.firebasestorage.app",
    messagingSenderId: "680960712772",
    appId: "1:680960712772:web:8f028c09937aee68c05c11",
    measurementId: "G-4NEQX26GY1"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

