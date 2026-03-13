import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'REDACTED',
  authDomain: 'motopirueta-ef11e.firebaseapp.com',
  projectId: 'motopirueta-ef11e',
  storageBucket: 'motopirueta-ef11e.firebasestorage.app',
  messagingSenderId: '213299644118',
  appId: '1:213299644118:web:1ce5f4f57b57480aca6b77',
  measurementId: 'G-YXEBQR7VVL',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
