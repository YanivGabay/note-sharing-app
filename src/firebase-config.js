import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
if (!firebaseConfig.apiKey) {
  throw new Error("Missing Firebase configuration. Check .env file.");
}
if (!firebaseConfig.authDomain) {
  throw new Error("Missing Firebase configuration. Check .env file.");
}
if (!firebaseConfig.projectId) {
  throw new Error("Missing Firebase configuration. Check .env file.");
}
if (!firebaseConfig.storageBucket) {
  throw new Error("Missing Firebase configuration. Check .env file.");
}
if (!firebaseConfig.messagingSenderId) {
  throw new Error("Missing Firebase configuration. Check .env file.");
}
if (!firebaseConfig.appId) {
  throw new Error("Missing Firebase configuration. Check .env file.");
}



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
