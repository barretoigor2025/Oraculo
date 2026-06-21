import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDaMymxJBFo9zaPuflFwhh14fslaaeh324',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'oraculo-rpg-dadfe.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'oraculo-rpg-dadfe',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'oraculo-rpg-dadfe.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '287997672755',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:287997672755:web:9094e22e975696dcdc9246',
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

export const firebaseApp = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
