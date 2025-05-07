// app/lib/firebase/config.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDXsDtXK_yOf8bu9KO7m680-zgbBnK0g4A",
  authDomain: "volunteer-connect-2d1b4.firebaseapp.com",
  projectId: "volunteer-connect-2d1b4",
  storageBucket: "volunteer-connect-2d1b4.firebasestorage.app",
  messagingSenderId: "560928180195",
  appId: "1:560928180195:web:1418c7c5348682621582d6",
  measurementId: "G-MZ9J8536TZ"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
