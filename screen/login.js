import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { loginUser, registerUser } from "./firebaseConfig";

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Login
  const handleLogin = async () => {
    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", "Logged in successfully!");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  // Handle Register
  const handleSignUp = async () => {
    setLoading(true);
    const result = await registerUser(email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", "User registered successfully!");
    } else {
      Alert.alert("Error", result.message);
    }
  };
  return (
    <View style={styles.container}>
      {/* Curved Background */}
      <View style={styles.headerBackground}>
        <View style={styles.curvedShape} />
      </View>

      {/* Login Form */}
      <View style={styles.content}>
        <Text style={styles.loginText}>Login</Text>

        <TextInput placeholder="Email" placeholderTextColor="#D3B8AE" style={styles.input} />
        <TextInput placeholder="Password" placeholderTextColor="#D3B8AE" secureTextEntry style={styles.input} />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Social Login Buttons */}
        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="google" size={24} color="#EA4335" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="apple" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>New Here? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles
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
