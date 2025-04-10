import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

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

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <BlurView intensity={80} tint="dark" style={styles.tabBarContainer}>
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
                route.name === 'Map' && styles.centerTabItem
              ]}
            >
              <TouchableOpacity
                onPress={onPress}
                style={[
                  styles.tabButton,
                  route.name === 'Map' && styles.centerTabButton
                ]}
              >
                {options.tabBarIcon({ 
                  color: isFocused ? '#4B7BE5' : '#9E9E9E',
                  focused: isFocused,
                })}
                <Animated.Text style={[
                  styles.tabLabel,
                  { 
                    color: isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                    fontSize: 12,
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
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="bell" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="address-book" size={22} color={color} />
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
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="book" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={22} color={color} />
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
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerTabItem: {
    marginTop: -30,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontWeight: '500',
  },
  mapIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#4B7BE5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mapIconContainerActive: {
    backgroundColor: '#4B7BE5',
    borderColor: '#fff',
  },
});

export default MainScreen; 