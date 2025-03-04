import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { logoutUser } from "./firebaseConfig";

const RegisterScreen = ({navigation}) => {
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      Alert.alert("Logged out successfully!");
      navigation.replace("Login");
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

      {/* Registration Form */}
      <View style={styles.content}>
        <Text style={styles.registerText}>Register</Text>

        <TextInput placeholder="Full Name" placeholderTextColor="#D3B8AE" style={styles.input} />
        <TextInput placeholder="Email" placeholderTextColor="#D3B8AE" style={styles.input} />
        <TextInput placeholder="Password" placeholderTextColor="#D3B8AE" secureTextEntry style={styles.input} />

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

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already Member? </Text>
          <TouchableOpacity>
            <Text style={styles.loginLink}>Login</Text>
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