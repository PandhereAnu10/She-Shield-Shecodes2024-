import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// Map Screen Component
const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
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
        tabBarActiveTintColor: '#FF1493',
        tabBarInactiveTintColor: '#3D212B',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingBottom: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="bell" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="address-book" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.mapIconContainer}>
              <FontAwesome5 name="map-marker-alt" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="book" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={24} color={color} />
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
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MainScreen; 