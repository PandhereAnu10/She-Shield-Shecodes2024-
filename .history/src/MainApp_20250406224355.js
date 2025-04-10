import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { FontAwesome5 } from '@expo/vector-icons';
import MainScreen from './screens/MainScreen';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: 1,
    title: 'Welcome to SheShield',
    text: 'Your personal safety companion, designed to protect and empower.',
    icon: 'shield-alt',
  },
  {
    key: 2,
    title: 'Emergency Assistance',
    text: 'Quick access to emergency contacts and instant alerts when you need help.',
    icon: 'bell',
  },
  {
    key: 3,
    title: 'Location Tracking',
    text: 'Share your location with trusted contacts and find safe routes.',
    icon: 'map-marker-alt',
  },
  {
    key: 4,
    title: 'Safety Resources',
    text: 'Access comprehensive safety guides and connect with the community.',
    icon: 'book',
  },
];

const MainApp = () => {
  const [showRealApp, setShowRealApp] = useState(false);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name={item.icon} size={80} color="#FFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <FontAwesome5 name="arrow-right" size={24} color="#FFF" />
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <FontAwesome5 name="check" size={24} color="#FFF" />
      </View>
    );
  };

  if (showRealApp) {
    return <MainScreen />;
  }

  return (
    <View style={styles.container}>
      <AppIntroSlider
        data={slides}
        renderItem={renderItem}
        onDone={() => setShowRealApp(true)}
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        style={{ backgroundColor: '#3D212B' }}
        showSkipButton={true}
        renderSkipButton={() => (
          <View style={styles.buttonCircle}>
            <Text style={{ color: '#FFF', fontSize: 16 }}>Skip</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D212B',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D212B',
    paddingBottom: 100,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  textContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  text: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 28,
  },
  buttonCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginHorizontal: 4,
  },
}); 