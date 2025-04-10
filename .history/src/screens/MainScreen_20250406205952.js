import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, Alert } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker, Circle } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';

const Tab = createBottomTabNavigator();

// Map Screen Component
const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to use the map features',
          [{ text: 'OK' }]
        );
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(location);

        // Watch position for real-time updates
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );
      } catch (error) {
        setErrorMsg('Error getting location');
        console.error(error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        initialRegion={{
          latitude: location?.coords.latitude || 19.0760,
          longitude: location?.coords.longitude || -98.2833,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : undefined}
      >
        {location && (
          <>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
            >
              <FontAwesome5 name="map-marker" size={40} color="#3D212B" />
            </Marker>
            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={100}
              fillColor="rgba(61, 33, 43, 0.2)"
              strokeColor="rgba(61, 33, 43, 0.5)"
            />
          </>
        )}
      </MapView>
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

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <BlurView intensity={50} tint="dark" style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Animated.View 
              key={route.key} 
              style={[
                styles.tabItem,
                isFocused && styles.focusedTabItem
              ]}
            >
              <TouchableOpacity
                onPress={onPress}
                style={[
                  styles.tabButton,
                  isFocused && styles.focusedTabButton
                ]}
              >
                <Animated.View style={[
                  styles.iconContainer,
                  isFocused && styles.focusedIconContainer,
                  {
                    transform: [
                      { scale: isFocused ? 1.2 : 1 },
                      { translateY: isFocused ? -30 : 0 }
                    ]
                  }
                ]}>
                  {options.tabBarIcon({ 
                    color: isFocused ? '#fff' : 'rgba(255,255,255,0.6)',
                    focused: isFocused,
                    size: 24
                  })}
                </Animated.View>
                <Animated.Text style={[
                  styles.tabLabel,
                  { 
                    color: isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                    fontSize: 12,
                    opacity: isFocused ? 1 : 0.8,
                    transform: [{ translateY: isFocused ? -15 : 0 }]
                  }
                ]}>
                  {label}
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </BlurView>
  );
};

const MainScreen = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      initialRouteName="Map"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="address-book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marker-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
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
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 25,
    backgroundColor: 'rgba(61, 33, 43, 0.9)', // #3D212B with opacity
    overflow: 'visible',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    paddingBottom: 15,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  focusedIconContainer: {
    width: 65,
    height: 65,
    backgroundColor: '#3D212B',
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  tabLabel: {
    marginTop: 4,
    fontWeight: '500',
    fontSize: 12,
  },
});

export default MainScreen; 