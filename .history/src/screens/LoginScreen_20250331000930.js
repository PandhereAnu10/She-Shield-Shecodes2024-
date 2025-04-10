import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, getAuth } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '686962153219-63lu2mhalo0iv068at3g0db66j21fofk.apps.googleusercontent.com',
    webClientId: '686962153219-8ikf8ml6cd6qtq9nq2lmvjkv22seqkp1.apps.googleusercontent.com',
    scopes: ['profile', 'email']
  });

  useEffect(() => {
    const handleSignInWithGoogle = async () => {
      if (response?.type === 'success') {
        try {
          const { id_token } = response.params;
          console.log("Got ID token:", id_token);
          
          const credential = GoogleAuthProvider.credential(id_token);
          console.log("Created credential");

          // Get a fresh auth instance
          const auth = getAuth();
          console.log("Got auth instance");

          const userCredential = await signInWithCredential(auth, credential);
          console.log("Signed in successfully:", userCredential.user.email);
          
          await AsyncStorage.setItem('userToken', userCredential.user.uid);
          navigation.replace("MainApp");
        } catch (error) {
          console.error('Detailed Google Sign-In error:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          Alert.alert(
            'Sign In Error',
            `Failed to sign in with Google: ${error.message}`,
            [{ text: 'OK' }]
          );
        }
      } else if (response?.type === 'error') {
        console.error('Google Sign-In Response Error:', response.error);
        Alert.alert(
          'Sign In Error',
          `Google sign in failed: ${response.error?.message || 'Unknown error'}`,
          [{ text: 'OK' }]
        );
      }
    };

    handleSignInWithGoogle();
  }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      if (!request) {
        console.log('Google Sign-In request not ready');
        Alert.alert('Error', 'Google Sign-In is not ready yet. Please try again.');
        return;
      }
      
      console.log('Starting Google Sign-In prompt...');
      const result = await promptAsync();
      console.log('Google Sign-In prompt result:', result);
      
    } catch (error) {
      console.error('Google Sign-In Error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      Alert.alert(
        'Error',
        `Failed to start Google Sign-In: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Successfully signed in:', userCredential.user);
      await AsyncStorage.setItem('userToken', userCredential.user.uid);
      navigation.replace("MainApp");
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', 'Invalid email or password');
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
          style={styles.loginButton} 
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
          style={styles.iconButton} 
          onPress={handleGoogleSignIn}
          disabled={loading}
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