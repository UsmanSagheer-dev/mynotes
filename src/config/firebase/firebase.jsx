
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBneMsxvM_onIhHcnBu9bP7IASI7xWA7VA",
  authDomain: "facebook-clone-copy-90fd0.firebaseapp.com",
  databaseURL: "https://facebook-clone-copy-90fd0-default-rtdb.firebaseio.com",
  projectId: "facebook-clone-copy-90fd0",
  storageBucket: "facebook-clone-copy-90fd0.appspot.com",
  messagingSenderId: "522087393808",
  appId: "1:522087393808:web:059199313ae0851495f895",
  measurementId: "G-FQ45YL58L5"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

