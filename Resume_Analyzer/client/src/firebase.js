// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKnyEu04RPAJE71LKwvGxl0Nrx8Vj13s4",
  authDomain: "resume-ranker-8b69d.firebaseapp.com",
  projectId: "resume-ranker-8b69d",
  storageBucket: "resume-ranker-8b69d.firebasestorage.app",
  messagingSenderId: "620035588131",
  appId: "1:620035588131:web:3f6cbca817ca319714f196",
  measurementId: "G-LEJ36MPN5Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut, onAuthStateChanged };
