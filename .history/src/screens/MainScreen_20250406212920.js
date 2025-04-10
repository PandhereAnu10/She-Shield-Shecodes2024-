import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, Alert, ActivityIndicator, Text, ScrollView } from 'react-native';
import MapView from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';

const Tab = createBottomTabNavigator();
const ResourcesStack = createNativeStackNavigator();

// Map Screen Component
const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
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

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(location);
      } catch (error) {
        setErrorMsg('Error getting location');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3D212B" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: location?.coords?.latitude || 19.0760,
          longitude: location?.coords?.longitude || -98.2833,
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

const safetyContent = {
  'Safety at Work': {
    tips: [
      "Trust your instincts - if a situation feels unsafe, it probably is",
      "Always keep emergency contacts readily available",
      "Know your workplace layout and emergency exits",
      "Be aware of your surroundings, especially in isolated areas",
      "Keep your personal belongings secure",
      "Avoid working alone late at night if possible"
    ],
    emergencyContacts: [
      { name: "Police", number: "100" },
      { name: "Women Helpline", number: "1091" },
      { name: "National Emergency Number", number: "112" }
    ],
    preventiveMeasures: [
      "Share your work schedule with trusted colleagues or family",
      "Keep your phone charged and easily accessible",
      "Document any harassment or concerning incidents",
      "Learn about your workplace's security protocols",
      "Save security desk numbers in your phone"
    ],
    legalRights: [
      "Right to a safe working environment",
      "Protection against sexual harassment (POSH Act)",
      "Right to file complaints without retaliation",
      "Right to work in a discrimination-free environment"
    ]
  },
  'Safety at Home': {
    tips: [
      "Install strong locks on all doors and windows",
      "Never open doors to strangers without verification",
      "Keep emergency numbers easily accessible",
      "Have a safety plan and share it with trusted neighbors",
      "Install security cameras or peepholes"
    ],
    emergencyContacts: [
      { name: "Police", number: "100" },
      { name: "Fire", number: "101" },
      { name: "Ambulance", number: "102" },
      { name: "Women Helpline", number: "1091" }
    ],
    preventiveMeasures: [
      "Regular check of security systems",
      "Keep areas around entry points well-lit",
      "Join neighborhood watch programs",
      "Have a backup power source for security systems",
      "Create emergency escape plans"
    ],
    safetyChecklist: [
      "Check all locks before sleeping",
      "Don't post about being home alone on social media",
      "Keep valuables in a secure place",
      "Have emergency supplies ready"
    ]
  },
  'Safety at University': {
    tips: [
      "Walk in well-lit areas on campus",
      "Use buddy system when studying late",
      "Keep campus security numbers saved",
      "Know locations of emergency phones",
      "Stay alert and avoid distractions while walking"
    ],
    emergencyContacts: [
      { name: "Campus Security", number: "Your University Security Number" },
      { name: "Police", number: "100" },
      { name: "Women Helpline", number: "1091" },
      { name: "University Counselor", number: "University Specific" }
    ],
    preventiveMeasures: [
      "Attend self-defense workshops",
      "Use university escort services when available",
      "Keep friends informed of your schedule",
      "Download campus safety apps",
      "Join women's safety groups"
    ],
    resources: [
      "University counseling services",
      "Women's support groups",
      "Student safety organizations",
      "Anti-harassment committees"
    ]
  },
  'Women Safety Online': {
    tips: [
      "Use strong, unique passwords",
      "Enable two-factor authentication",
      "Be careful with personal information sharing",
      "Check privacy settings regularly",
      "Be cautious with friend requests"
    ],
    emergencyContacts: [
      { name: "Cyber Crime Helpline", number: "155260" },
      { name: "Women Cyber Cell", number: "1091" },
      { name: "National Cyber Crime Portal", link: "cybercrime.gov.in" }
    ],
    preventiveMeasures: [
      "Regular security updates",
      "Use secure networks",
      "Avoid public Wi-Fi for sensitive tasks",
      "Be careful with location sharing",
      "Report online harassment immediately"
    ],
    onlineSafetyTools: [
      "VPN services",
      "Password managers",
      "Anti-virus software",
      "Privacy-focused browsers"
    ]
  },
  'Safety on the Streets': {
    tips: [
      "Stay alert and aware of surroundings",
      "Walk confidently and purposefully",
      "Avoid isolated areas, especially at night",
      "Keep emergency contacts on speed dial",
      "Trust your instincts"
    ],
    emergencyContacts: [
      { name: "Police", number: "100" },
      { name: "Women Helpline", number: "1091" },
      { name: "Emergency Number", number: "112" },
      { name: "Local Police Station", number: "Save your local station number" }
    ],
    preventiveMeasures: [
      "Learn basic self-defense",
      "Carry personal safety devices",
      "Share live location with trusted contacts",
      "Keep keys ready before reaching destination",
      "Walk in well-lit areas"
    ],
    safetyApps: [
      "SheShield - Your Current App",
      "Emergency SOS features on phone",
      "Location sharing apps",
      "Local police apps"
    ]
  }
};

const SafetyDetailScreen = ({ route, navigation }) => {
  const { title } = route.params;
  const content = safetyContent[title];

  return (
    <View style={styles.safetyDetailContainer}>
      <View style={styles.safetyHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="chevron-left" size={20} color="#3D212B" />
        </TouchableOpacity>
        <Text style={styles.safetyTitle}>{title}</Text>
        <View style={styles.safetyIcon}>
          <FontAwesome5 name="shield-alt" size={24} color="#3D212B" />
        </View>
      </View>
      <ScrollView 
        style={styles.safetyContent}
        contentContainerStyle={styles.safetyContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Essential Tips</Text>
          {content.tips.map((tip, index) => (
            <View key={index} style={styles.tipContainer}>
              <FontAwesome5 name="check-circle" size={16} color="#3D212B" style={styles.tipIcon} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {content.emergencyContacts.map((contact, index) => (
            <View key={index} style={styles.contactContainer}>
              <FontAwesome5 name="phone-alt" size={16} color="#3D212B" style={styles.contactIcon} />
              <Text style={styles.contactName}>{contact.name}:</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preventive Measures</Text>
          {content.preventiveMeasures.map((measure, index) => (
            <View key={index} style={styles.tipContainer}>
              <FontAwesome5 name="shield-alt" size={16} color="#3D212B" style={styles.tipIcon} />
              <Text style={styles.tipText}>{measure}</Text>
            </View>
          ))}
        </View>

        {content.legalRights && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal Rights</Text>
            {content.legalRights.map((right, index) => (
              <View key={index} style={styles.tipContainer}>
                <FontAwesome5 name="gavel" size={16} color="#3D212B" style={styles.tipIcon} />
                <Text style={styles.tipText}>{right}</Text>
              </View>
            ))}
          </View>
        )}

        {content.safetyChecklist && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety Checklist</Text>
            {content.safetyChecklist.map((item, index) => (
              <View key={index} style={styles.tipContainer}>
                <FontAwesome5 name="clipboard-check" size={16} color="#3D212B" style={styles.tipIcon} />
                <Text style={styles.tipText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {content.resources && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Resources</Text>
            {content.resources.map((resource, index) => (
              <View key={index} style={styles.tipContainer}>
                <FontAwesome5 name="bookmark" size={16} color="#3D212B" style={styles.tipIcon} />
                <Text style={styles.tipText}>{resource}</Text>
              </View>
            ))}
          </View>
        )}

        {content.onlineSafetyTools && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Online Safety Tools</Text>
            {content.onlineSafetyTools.map((tool, index) => (
              <View key={index} style={styles.tipContainer}>
                <FontAwesome5 name="tools" size={16} color="#3D212B" style={styles.tipIcon} />
                <Text style={styles.tipText}>{tool}</Text>
              </View>
            ))}
          </View>
        )}

        {content.safetyApps && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Safety Apps</Text>
            {content.safetyApps.map((app, index) => (
              <View key={index} style={styles.tipContainer}>
                <FontAwesome5 name="mobile-alt" size={16} color="#3D212B" style={styles.tipIcon} />
                <Text style={styles.tipText}>{app}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const ResourcesScreen = ({ navigation }) => {
  const safetyCategories = [
    { id: 1, title: 'Safety at Work', icon: 'briefcase' },
    { id: 2, title: 'Safety at Home', icon: 'home' },
    { id: 3, title: 'Safety at University', icon: 'graduation-cap' },
    { id: 4, title: 'Women Safety Online', icon: 'globe' },
    { id: 5, title: 'Safety on the Streets', icon: 'street-view' },
  ];

  return (
    <View style={styles.resourcesContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Bible of Safety</Text>
        <View style={styles.headerIcon}>
          <FontAwesome5 name="shield-alt" size={24} color="#3D212B" />
        </View>
      </View>
      <ScrollView style={styles.categoriesContainer}>
        {safetyCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryButton}
            onPress={() => navigation.navigate('SafetyDetail', { title: category.title })}
          >
            <Text style={styles.categoryText}>{category.title}</Text>
            <FontAwesome5 name="chevron-right" size={20} color="#fff" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

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

const ResourcesStackScreen = () => {
  return (
    <ResourcesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ResourcesStack.Screen name="ResourcesList" component={ResourcesScreen} />
      <ResourcesStack.Screen name="SafetyDetail" component={SafetyDetailScreen} />
    </ResourcesStack.Navigator>
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
        component={ResourcesStackScreen}
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
    color: '#3D212B',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  resourcesContainer: {
    flex: 1,
    backgroundColor: '#FFF5EB',
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3D212B',
    marginRight: 10,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  categoryButton: {
    backgroundColor: '#3D212B',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  safetyDetailContainer: {
    flex: 1,
    backgroundColor: '#FFF5EB',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    padding: 10,
  },
  safetyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D212B',
  },
  safetyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyContent: {
    flex: 1,
    padding: 16,
  },
  safetyContentContainer: {
    paddingBottom: 120, // Add extra padding at bottom to account for tab bar
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D212B',
    marginBottom: 16,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 8,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#3D212B',
    lineHeight: 24,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D212B',
    marginRight: 8,
  },
  contactNumber: {
    fontSize: 16,
    color: '#3D212B',
  },
});

export default MainScreen; 