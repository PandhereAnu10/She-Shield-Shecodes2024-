import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to SheShield</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import AppIntroSlider from 'react-native-app-intro-slider';

// const slides = [
//   {
//     key: '1',
//     title: 'Your Safety, Our Priority',
//     text: 'Empowering women with tools to stay safe and connected.',
//     image: require('./assets/women_shield.png'), // Add your dark-themed illustrations here
//     backgroundColor: '#1F1F1F',
//   },
//   {
//     key: '2',
//     title: 'Stay Protected Anytime, Anywhere',
//     text: '• Instant SOS alerts\n• Live location sharing\n• Easy access to emergency numbers',
//     image: require('./assets/safety_features.png'),
//     backgroundColor: '#252525',
//   },
//   {
//     key: '3',
//     title: 'Your Data, Your Control',
//     text: 'Your safety is our commitment. All your data remains private and secure.',
//     image: require('./assets/security_lock.png'),
//     backgroundColor: '#1F1F1F',
//   },
//   {
//     key: '4',
//     title: 'Ready to Get Started?',
//     text: 'Let’s set up your account and help you stay connected and secure.',
//     backgroundColor: '#252525',
//   },
// ];

// export default function App() {
//   const _renderItem = ({ item }) => (
//     <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
//       <Image source={item.image} style={styles.image} />
//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.text}>{item.text}</Text>
//     </View>
//   );

//   const _onDone = () => {
//     console.log('Onboarding complete!');
//     // Replace this with navigation or main app screen logic
//   };

//   return <AppIntroSlider renderItem={_renderItem} data={slides} onDone={_onDone} />;
// }

// const styles = StyleSheet.create({
//   slide: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   image: {
//     width: 300,
//     height: 300,
//     marginBottom: 20,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   text: {
//     color: '#ccc',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

