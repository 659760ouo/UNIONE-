// app/firebase.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth"; // Use @firebase/auth

// Your Firebase config (unchanged)
const firebaseConfig = {
  apiKey: "AIzaSyBFXMTzkgxhVCqpouL4gvq-yPZbAUlBXeU",
  authDomain: "goaltracker-32d4c.web.app",
  projectId: "goaltracker-32d4c",
  storageBucket: "goaltracker-32d4c.firebasestorage.app",
  messagingSenderId: "337695431184",
  appId: "1:337695431184:android:c280c68c777f3e96fa4895",
  
};

// 1. Initialize Firebase app FIRST
const app = initializeApp(firebaseConfig);

// 2. Initialize Auth with React Native persistence (NO custom objects!)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Official adapter (class-based)
});

// Verify initialization (optional)
console.log("Firebase App Ready:", app.name ? "Yes" : "No");
console.log("Firebase Auth Ready:", auth ? "Yes" : "No");

// Export for use in other components
export const getFirebaseAuth = () => auth;

export default null;