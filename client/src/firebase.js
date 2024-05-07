// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestateapp-29c00.firebaseapp.com",
  projectId: "realestateapp-29c00",
  storageBucket: "realestateapp-29c00.appspot.com",
  messagingSenderId: "813875237211",
  appId: "1:813875237211:web:0d039040cb6c598fc30a7e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);