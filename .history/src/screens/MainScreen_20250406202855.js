import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// Map Screen Component
const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: 19.0760,
          longitude: -98.2833,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType="standard"
      />
    </View>
  );
};

// Placeholder screens for other tabs
const AlertsScreen = () => (
  <View style={styles.centerContainer}>
    <FontAwesome5 name="bell" size={50} color="#3D212B" />
  </View>
);

const ContactsScreen = () => (
  <View style={styles.centerContainer}>
    <FontAwesome5 name="address-book" size={50} color="#3D212B" />
  </View>
);

const ResourcesScreen = () => (
  <View style={styles.centerContainer}>
    <FontAwesome5 name="book" size={50} color="#3D212B" />
  </View>
);

const ProfileScreen = () => (
  <View style={styles.centerContainer}>
    <FontAwesome5 name="user" size={50} color="#3D212B" />
  </View>
);

const MainScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={{
        tabBarActiveTintColor: '#4B7BE5',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#1A1B1F',
          borderTopWidth: 0,
          elevation: 10,
          height: 70,
          borderRadius: 20,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="wallet" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.mapIconContainer, focused && styles.mapIconContainerActive]}>
              <FontAwesome5 
                name="map-marker-alt" 
                size={24} 
                color={focused ? '#fff' : '#4B7BE5'} 
              />
            </View>
          ),
          tabBarLabel: 'Exchange',
        }}
      />
      <Tab.Screen
        name="Markets"
        component={ResourcesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="store" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="briefcase" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mapIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#1A1B1F',
  },
  mapIconContainerActive: {
    backgroundColor: '#4B7BE5',
    borderColor: '#fff',
  },
});

export default MainScreen; 