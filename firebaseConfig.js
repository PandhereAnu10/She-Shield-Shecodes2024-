import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

//Firebase config object 
const firebaseConfig = {
  apiKey: "AIzaSyBau37rPRrBlLexhJjoIcP2L_xTh7Tuu8c",
  authDomain: "womensafetyapp-47089.firebaseapp.com",
  projectId: "womensafetyapp-47089",
  storageBucket: "womensafetyapp-47089.firebasestorage.app",
  messagingSenderId: "686962153219",
  appId: "1:686962153219:web:c5f187315b8f50dfe03b36",
  measurementId: "G-PFHV34S7NX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function for User Registration
export const registerUser = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Function for User Login
export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Function for Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export { auth };
