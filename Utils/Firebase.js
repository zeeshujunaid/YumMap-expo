// ✅ Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDj2wkEA4BBZjYsr3dwKCUhC4uPMWals9w",
  authDomain: "yummap-85c45.firebaseapp.com",
  projectId: "yummap-85c45",
  storageBucket: "yummap-85c45.appspot.com",
  messagingSenderId: "1001298190569",
  appId: "1:1001298190569:web:9b19c841e44eedbeb61078",
  measurementId: "G-75WWE9W405"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Use named export
