import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from. 'expo-auth-session';.

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Updated Google Auth configuration using expo-auth-session/providers/google
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Use the web client ID from your Firebase project
    webClientId: '686962153219-63lu2mhalo0iv068at3g0db66j21fofk.apps.googleusercontent.com',
    // For Android, use the client ID specifically created for Android
    androidClientId: '686962153219-63lu2mhalo0iv068at3g0db66j21fofk.apps.googleusercontent.com',
    // A more compatible redirect URI format for Expo Go
    expoClientId: '686962153219-63lu2mhalo0iv068at3g0db66j21fofk.apps.googleusercontent.com',
    // Required scopes
    scopes: ['profile', 'email'],
    // This is important for Expo Go; it creates a proper redirectUri
    redirectUri: makeRedirectUri({
      scheme: 'com.sheshield.app',
      path: 'oauth'
    })
  });

  useEffect(() => {
    console.log("Response changed:", response);
    
    if (response?.type === 'success') {
      const { id_token, access_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token, access_token);
      
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log('Successfully signed in with Google:', userCredential.user.email);
          navigation.replace("MainApp");
        })
        .catch((error) => {
          console.error('Error signing in with Google:', error);
          Alert.alert('Error', 'Failed to sign in with Google: ' + error.message);
        });
    } else if (response?.type === 'error') {
      console.error('OAuth Error:', response.error);
      Alert.alert('Error', 'Google Sign-In failed: ' + (response.error?.message || 'Unknown error'));
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Starting Google Sign-In...');
      console.log('Redirect URI:', makeRedirectUri({
        scheme: 'com.sheshield.app',
        path: 'oauth'
      }));
      
      // For Expo Go, use proxy. For standalone apps, set to false
      await promptAsync({ useProxy: true, showInRecents: true });
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      Alert.alert('Error', 'Failed to sign in with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Successfully signed in:', userCredential.user.email);
      navigation.replace("MainApp");
    } catch (error) {
      console.error('Error signing in:', error);
      // More specific error message
      let errorMessage = 'Invalid email or password';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is invalid.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity 
          style={[styles.iconButton, loading && styles.disabledButton]} 
          onPress={handleGoogleSignIn}
          disabled={loading || !request}
        >
          <FontAwesome name="google" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3D212B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#3D212B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  iconButton: {
    backgroundColor: '#3D212B',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#3D212B',
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#3D212B',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;