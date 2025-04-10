import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Switch, List, useTheme, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyMessage: 'I need help! Please check my location.',
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    loadProfile();
    loadThemePreference();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('user_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async (newProfile) => {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const handleThemeToggle = async () => {
    try {
      const newTheme = !isDarkMode;
      await AsyncStorage.setItem('theme_preference', newTheme ? 'dark' : 'light');
      setIsDarkMode(newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const handleSave = () => {
    saveProfile(profile);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Icon size={80} icon="account" />
      </View>

      <View style={styles.section}>
        <TextInput
          label="Name"
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={profile.email}
          onChangeText={(text) => setProfile({ ...profile, email: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          label="Phone Number"
          value={profile.phone}
          onChangeText={(text) => setProfile({ ...profile, phone: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
        />

        <TextInput
          label="Emergency Message"
          value={profile.emergencyMessage}
          onChangeText={(text) => setProfile({ ...profile, emergencyMessage: text })}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <List.Item
          title="Dark Mode"
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              color={theme.colors.primary}
            />
          )}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
      >
        Save Changes
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  section: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    margin: 16,
  },
});

export default ProfileScreen; 