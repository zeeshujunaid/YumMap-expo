// ✅ Firebase.js

import { initializeApp } from "firebase/app";
import {  initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDj2wkEA4BBZjYsr3dwKCUhC4uPMWals9w",
  authDomain: "yummap-85c45.firebaseapp.com",
  projectId: "yummap-85c45",
  storageBucket: "yummap-85c45.appspot.com",
  messagingSenderId: "1001298190569",
  appId: "1:1001298190569:web:9b19c841e44eedbeb61078",
  measurementId: "G-75WWE9W405"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Export both
export { auth };
export const db = getFirestore(app);
