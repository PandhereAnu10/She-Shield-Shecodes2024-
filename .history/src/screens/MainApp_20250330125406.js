import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { logoutUser } from '../services/auth';

const MainApp = ({ navigation }) => {
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SheShield</Text>
      <Text style={styles.subtitle}>Your safety companion</Text>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBE9D0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3D212B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#5A2F3E',
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#FF3D71',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainApp; 