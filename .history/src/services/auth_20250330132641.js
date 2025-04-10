import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Configure Google Sign In
const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: '686962153219-63lu2mhalo0iv068at3g0db66j21fofk.apps.googleusercontent.com', 
  webClientId: '686962153219-8ikf8ml6cd6qtq9nq2lmvjkv22seqkp1.apps.googleusercontent.com', // Your web client ID from Firebase console
});

export const signInWithGoogle = async () => {
  try {
    const result = await promptAsync();
    if (result.type === 'success') {
      const { id_token } = result.params;
      const credential = GoogleAuthProvider.credential(id_token);
      const userCredential = await signInWithCredential(auth, credential);
      return { success: true, user: userCredential.user };
    }
    return { success: false, message: 'Google Sign In was cancelled or failed' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}; 