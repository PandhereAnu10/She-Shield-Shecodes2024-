import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { loginUser, handleGoogleCredential } from "../services/auth";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '686962153219-4qqtqvvtpjf5qqj5qqj5qqj5qqj5qqj.apps.googleusercontent.com',
    androidClientId: '686962153219-63lu2mhalo0iv068at3g0db66j21fofk.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      navigation.replace("MainApp");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const handleGoogleSignIn = async (idToken) => {
    try {
      setLoading(true);
      const result = await handleGoogleCredential(idToken);
      if (result.success) {
        navigation.replace("MainApp");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <View style={styles.curvedShape} />
      </View>

      <View style={styles.content}>
        <Text style={styles.loginText}>Login</Text>

        <TextInput 
          placeholder="Email" 
          placeholderTextColor="#D3B8AE" 
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          placeholder="Password" 
          placeholderTextColor="#D3B8AE" 
          secureTextEntry 
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.socialIcons}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => promptAsync()}
            disabled={loading}
          >
            <FontAwesome name="google" size={24} color="#EA4335" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="apple" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Loading..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>New Here? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D212B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '40%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  curvedShape: {
    width: '150%',
    height: '100%',
    backgroundColor: '#FBE9D0',
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    transform: [{ translateX: -50 }],
  },
  content: {
    width: '85%',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 24,
    color: '#FBE9D0',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#FBE9D0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    color: '#FBE9D0',
    backgroundColor: '#5A2F3E',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  forgotText: {
    color: '#D3B8AE',
    fontSize: 12,
  },
  socialIcons: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  iconButton: {
    backgroundColor: '#FBE9D0',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  loginButton: {
    backgroundColor: '#FBE9D0',
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D212B',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  registerText: {
    color: '#D3B8AE',
  },
  registerLink: {
    color: '#FBE9D0',
    fontWeight: 'bold',
  },
});

export default LoginScreen; 