import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import MapScreen from '../features/map/MapScreen';
import ContactsScreen from '../features/contacts/ContactsScreen';
import CommunityScreen from '../features/community/CommunityScreen';
import ProfileScreen from '../features/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = ({ toggleTheme }) => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
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

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
      })}
    >
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          title: 'Safety Map'
        }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen}
        options={{
          title: 'Emergency Contacts'
        }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{
          title: 'Community'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'My Profile'
        }}
        initialParams={{ toggleTheme }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator; 