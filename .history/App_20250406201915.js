import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AppIntroSlider from 'react-native-app-intro-slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';

const Stack = createNativeStackNavigator();

const slides = [
  {
    key: '1',
    title: 'Welcome to SheShield',
    text: 'Your personal safety companion that keeps you protected 24/7',
    icon: 'shield-check',
    backgroundColor: '#FF4B7B',
  },
  {
    key: '2',
    title: 'Emergency SOS',
    text: 'Quick access to emergency contacts and one-tap SOS alerts with location sharing',
    icon: 'alert-circle',
    backgroundColor: '#FF8BA7',
  },
  {
    key: '3',
    title: 'Safe Community',
    text: 'Connect with a supportive community and share safety tips anonymously',
    icon: 'account-group',
    backgroundColor: '#FFB4C6',
  },
  {
    key: '4',
    title: "Let's Get Started!",
    text: 'Your safety is our priority. Tap Start to begin your protected journey.',
    icon: 'rocket',
    backgroundColor: '#FF4B7B',
  }
];

export default function App() {
  const [showRealApp, setShowRealApp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <MaterialCommunityIcons name={item.icon} size={150} color="#FFF" style={styles.icon} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const onDone = () => {
    setShowRealApp(true);
  };

  if (!showRealApp) {
    return (
      <>
        <StatusBar style="light" />
        <AppIntroSlider
          renderItem={renderItem}
          data={slides}
          onDone={onDone}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          showSkipButton
          showPrevButton
          renderNextButton={() => <Text style={styles.buttonText}>Next</Text>}
          renderPrevButton={() => <Text style={styles.buttonText}>Back</Text>}
          renderSkipButton={() => <Text style={styles.buttonText}>Skip</Text>}
          renderDoneButton={() => <Text style={styles.buttonText}>Start</Text>}
        />
      </>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainApp" component={MainScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#FFF',
  },
});

