import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

// Import screens (we'll create these next)
import MapScreen from '../features/map/MapScreen';
import ContactsScreen from '../features/contacts/ContactsScreen';
import CommunityScreen from '../features/community/CommunityScreen';
import ProfileScreen from '../features/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const getTabBarIcon = (route, focused, color) => {
  let iconName;

  switch (route.name) {
    case 'Map':
      iconName = focused ? 'map-marker' : 'map-marker-outline';
      break;
    case 'Contacts':
      iconName = focused ? 'contacts' : 'contacts-outline';
      break;
    case 'Community':
      iconName = focused ? 'account-group' : 'account-group-outline';
      break;
    case 'Profile':
      iconName = focused ? 'account-circle' : 'account-circle-outline';
      break;
    default:
      iconName = 'circle';
  }

  return <Icon name={iconName} size={24} color={color} />;
};

const AppNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => getTabBarIcon(route, focused, color),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.disabled,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{ title: 'Safety Map' }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen}
        options={{ title: 'Emergency Contacts' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator; 