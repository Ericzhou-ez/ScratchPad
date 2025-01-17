// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyCgeFtIYhxjNqCrgw55_pqc-uleBLbkjYA",
   authDomain: "quick-notes-ec722.firebaseapp.com",
   projectId: "quick-notes-ec722",
   storageBucket: "quick-notes-ec722.firebasestorage.app",
   messagingSenderId: "87000586581",
   appId: "1:87000586581:web:4b7fac5585e54d7af6f7dc",
   measurementId: "G-N2DT5JVNKJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)