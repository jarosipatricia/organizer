// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgIkUOViBgMautfgdn9F0tb52P-gM_frc",
  authDomain: "organizer-7cc95.firebaseapp.com",
  databaseURL: "https://organizer-7cc95-default-rtdb.firebaseio.com",
  projectId: "organizer-7cc95",
  storageBucket: "organizer-7cc95.appspot.com",
  messagingSenderId: "133672846037",
  appId: "1:133672846037:web:0e07d2d313823f25e3d85c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();