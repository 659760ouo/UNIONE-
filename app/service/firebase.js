import { makeRedirectUri } from 'expo-auth-session';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// Explicitly provide your Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBFXMTzkgxhVCqpouL4gvq-yPZbAUlBXeU",
  authDomain: "goaltracker-32d4c.firebaseapp.com",
  projectId: "goaltracker-32d4c",
  storageBucket: "goaltracker-32d4c.appspot.com",
  messagingSenderId: "337695431184",
  appId: "1:337695431184:android:c280c68c777f3e96fa4895"
};

// Initialize Firebase with the config
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

console.log("✅ Firebase app connected successfully! App name:", app.name);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

export const redirectUri = makeRedirectUri({
  // Let Expo handle the redirect URI automatically
  useProxy: true, // This enables Expo's proxy to avoid local IP issues
});