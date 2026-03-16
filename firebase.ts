import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA60-0fcPA-WqYeCQaPuY2R3Fd365tzhkU",
  authDomain: "nibuy-banco-de-dados.firebaseapp.com",
  projectId: "nibuy-banco-de-dados",
  storageBucket: "nibuy-banco-de-dados.firebasestorage.app",
  messagingSenderId: "639899119190",
  appId: "1:639899119190:web:230ef61b72086faeaed5f7",
  measurementId: "G-Y17EDBZVTD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();