// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9vMJqEATNiGcydrLQ0uAATzAq82PG5tw",
  authDomain: "minesweeper-eedc3.firebaseapp.com",
  projectId: "minesweeper-eedc3",
  storageBucket: "minesweeper-eedc3.firebasestorage.app",
  messagingSenderId: "343315885206",
  appId: "1:343315885206:web:5a1ba28ed1f314511b66b7",
  measurementId: "G-X2JHY3S8B4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);