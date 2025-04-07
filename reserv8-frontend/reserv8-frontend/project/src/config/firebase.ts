// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmk-P_JMhu864aw9LyPCZ877lTr4eg0o8",
  authDomain: "reserv8-c3d6b.firebaseapp.com",
  projectId: "reserv8-c3d6b",
  storageBucket: "reserv8-c3d6b.firebasestorage.app",

  messagingSenderId: "514920434044",
  appId: "1:514920434044:web:c29a38cf1f756c5a2cfcf9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;