import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj2wkEA4BBZjYsr3dwKCUhC4uPMWals9w",
  authDomain: "yummap-85c45.firebaseapp.com",
  projectId: "yummap-85c45",
  storageBucket: "yummap-85c45.appspot.com", // ✅ FIXED from `.app` to `.com`
  messagingSenderId: "1001298190569",
  appId: "1:1001298190569:web:9b19c841e44eedbeb61078",
  measurementId: "G-75WWE9W405"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export the app
export const auth = getAuth(app);
export default app;
