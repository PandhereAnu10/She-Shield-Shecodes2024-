import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: '686962153219-8ikf8ml6cd6qtq9nq2lmvjkv22seqkp1.apps.googleusercontent.com',
  offlineAccess: true,
});

export { auth, GoogleSignin }; 