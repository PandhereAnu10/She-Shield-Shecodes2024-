import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { StatusBar } from 'expo-status-bar';

const slides = [
  {
    key: '1',
    title: 'Welcome to SheShield',
    text: 'Your personal safety companion that keeps you protected 24/7',
    backgroundColor: '#FF4B7B',
  },
  {
    key: '2',
    title: 'Emergency SOS',
    text: 'Quick access to emergency contacts and one-tap SOS alerts with location sharing',
    backgroundColor: '#FF8BA7',
  },
  {
    key: '3',
    title: 'Safe Community',
    text: 'Connect with a supportive community and share safety tips anonymously',
    backgroundColor: '#FFB4C6',
  },
  {
    key: '4',
    title: "Let's Get Started!",
    text: 'Your safety is our priority. Tap Start to begin your protected journey.',
    backgroundColor: '#FF4B7B',
  }
];

export default function App() {
  const [showRealApp, setShowRealApp] = useState(false);
  const { height } = useWindowDimensions();

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor, minHeight: height }]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const onDone = () => {
    setShowRealApp(true);
  };

  if (showRealApp) {
    return (
      <View style={styles.container}>
        <Text>Main App (Map Screen)</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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

