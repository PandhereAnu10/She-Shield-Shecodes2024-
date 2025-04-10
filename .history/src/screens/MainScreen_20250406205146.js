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
      <View style={styles.tabBarBackground} />
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
              {isFocused && (
                <View style={styles.iconBackground}>
                  <View style={styles.iconBackgroundInner} />
                </View>
              )}
              <TouchableOpacity
                onPress={onPress}
                style={[
                  styles.tabButton,
                  isFocused && styles.focusedTabButton
                ]}
              >
                <View style={[
                  styles.iconContainer,
                  isFocused && styles.focusedIconContainer
                ]}>
                  {options.tabBarIcon({ 
                    color: isFocused ? '#fff' : '#9E9E9E',
                    focused: isFocused,
                    size: 24
                  })}
                </View>
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
    height: 90,
    overflow: 'visible',
  },
  tabBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  iconBackground: {
    position: 'absolute',
    top: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  iconBackgroundInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 90,
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 90,
  },
  focusedTabItem: {
    transform: [{ translateY: -30 }],
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    height: 65,
  },
  focusedTabButton: {
    transform: [{ translateY: 0 }],
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
    backgroundColor: '#4B7BE5',
    borderRadius: 35,
    borderWidth: 3,
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