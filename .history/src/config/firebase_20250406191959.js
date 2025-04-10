import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const firebaseConfig = {
  apiKey: "AIzaSyDqYGqBxGXtVGQFXxBxlXxVZNGRXxZGUxE",
  authDomain: "womensafetyapp-47089.firebaseapp.com",
  projectId: "womensafetyapp-47089",
  storageBucket: "womensafetyapp-47089.appspot.com",
  messagingSenderId: "686962153219",
  appId: "1:686962153219:web:c5c0d4d9d3c7f7e5c5d5c5"
};

let app;
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  auth = getAuth();
}

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: '686962153219-8ikf8ml6cd6qtq9nq2lmvjkv22seqkp1.apps.googleusercontent.com',
});

export { auth, GoogleSignin }; 