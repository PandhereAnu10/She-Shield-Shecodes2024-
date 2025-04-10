import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBau37rPRrBlLexhJjoIcP2L_xTh7Tuu8c",
  authDomain: "womensafetyapp-47089.firebaseapp.com",
  projectId: "womensafetyapp-47089",
  storageBucket: "womensafetyapp-47089.firebasestorage.app",
  messagingSenderId: "686962153219",
  appId: "1:686962153219:web:c5f187315b8f50dfe03b36",
  measurementId: "G-PFHV34S7NX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 