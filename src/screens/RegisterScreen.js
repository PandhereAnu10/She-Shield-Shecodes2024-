import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { registerUser, signInWithGoogle } from "../services/auth";

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await registerUser(email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", "Registration successful!");
      navigation.replace("MainApp");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);

    if (result.success) {
      navigation.replace("MainApp");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <View style={styles.curvedShape} />
      </View>

      <View style={styles.content}>
        <Text style={styles.registerText}>Register</Text>

        <TextInput 
          placeholder="Full Name" 
          placeholderTextColor="#D3B8AE" 
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
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

        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleGoogleSignUp}>
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
          style={[styles.registerButton, loading && styles.disabledButton]} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            {loading ? "Loading..." : "Register"}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already Member? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF3D71',
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
  registerText: {
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
    backgroundColor: '#FF5A85',
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
  registerButton: {
    backgroundColor: '#FBE9D0',
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3D71',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  loginText: {
    color: '#D3B8AE',
  },
  loginLink: {
    color: '#FBE9D0',
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 