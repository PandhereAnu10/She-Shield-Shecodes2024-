import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBau37rPRrBlLexhJjoIcP2L_xTh7Tuu8c",
  authDomain: "womensafetyapp-47089.firebaseapp.com",
  projectId: "womensafetyapp-47089",
  storageBucket: "womensafetyapp-47089.firebasestorage.app",
  messagingSenderId: "686962153219",
  appId: "1:686962153219:web:c5f187315b8f50dfe03b36",
  measurementId: "G-PFHV34S7NX"
};

let app;
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

export { auth }; 