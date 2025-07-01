// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { 
  getFirestore, 
  enableMultiTabIndexedDbPersistence,
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in production
const analytics = process.env.NODE_ENV === 'production' ? getAnalytics(app) : null;

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Initialize Firestore with settings for better offline support
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // This can help with connection issues
  ignoreUndefinedProperties: true
});

// Enable offline persistence
if (process.env.NODE_ENV !== 'production') {
  // Use emulator in development if needed
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn('Multiple tabs open, persistence enabled in another tab');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('Current browser does not support persistence');
    }
  });
} catch (err) {
  console.warn('Error enabling persistence:', err);
}

// Function to check online status
const checkOnlineStatus = () => {
  return window.navigator.onLine;
};

// Add online/offline listeners
window.addEventListener('online', () => {
  console.log('App is online');
  // You might want to trigger a data refresh here
});

window.addEventListener('offline', () => {
  console.log('App is offline');
  // Handle offline state
});

export { auth, db, checkOnlineStatus };
export default app;