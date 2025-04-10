import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDqYGqBxGXtVGQFXxBxlXxVZNGRXxZGUxE",
  authDomain: "womensafetyapp-47089.firebaseapp.com",
  projectId: "womensafetyapp-47089",
  storageBucket: "womensafetyapp-47089.appspot.com",
  messagingSenderId: "686962153219",
  appId: "1:686962153219:web:c5c0d4d9d3c7f7e5c5d5c5"
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
let auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

export { auth }; 