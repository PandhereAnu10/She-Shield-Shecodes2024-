import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, Alert, ActivityIndicator, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, Image } from 'react-native';
import MapView from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as SMS from 'expo-sms';

const Tab = createBottomTabNavigator();
const ResourcesStack = createNativeStackNavigator();

// Map Screen Component
const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [isSelectingContact, setIsSelectingContact] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  useEffect(() => {
    loadEmergencyContacts();
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

  const loadEmergencyContacts = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        const parsedData = JSON.parse(profileData);
        // Filter out contacts without phone numbers
        const validContacts = parsedData.emergencyContacts?.filter(contact => contact.phone) || [];
        setEmergencyContacts(validContacts);
      }
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    }
  };

  const shareLocation = async (selectedContact) => {
    try {
      if (!location) {
        Alert.alert('Error', 'Unable to get your current location');
        return;
      }

      setIsSharingLocation(true);
      setIsSelectingContact(false);

      // Create Google Maps link
      const mapsUrl = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      const message = `🚨 EMERGENCY ALERT: I'm Unsafe! 🚨\n\nThis is an emergency alert. My current location is:\n${mapsUrl}\n\nPlease contact me immediately or call emergency services if needed.`;

      // Send SMS to selected contact
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync([selectedContact.phone], message);
        
        // Schedule a notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Location Shared",
            body: `Live location shared with ${selectedContact.name}`,
            data: { type: 'location_share' },
          },
          trigger: null, // Show immediately
        });
      } else {
        Alert.alert('Error', 'SMS is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      Alert.alert('Error', 'Failed to share location');
    } finally {
      setIsSharingLocation(false);
    }
  };

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
      <TouchableOpacity 
        style={[
          styles.shareLocationIcon,
          isSharingLocation && styles.shareLocationIconDisabled
        ]}
        onPress={() => setIsSelectingContact(true)}
        disabled={isSharingLocation}
      >
        <FontAwesome5 
          name={isSharingLocation ? "spinner" : "share-alt"} 
          size={24} 
          color="#FFF" 
        />
      </TouchableOpacity>

      {/* Contact Selection Modal */}
      <Modal
        visible={isSelectingContact}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSelectingContact(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Location</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsSelectingContact(false)}
              >
                <FontAwesome5 name="times" size={20} color="#3D212B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDescription}>
              Select an emergency contact to share your location with:
            </Text>
            <ScrollView style={styles.contactsList}>
              {emergencyContacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.contactSelectCard}
                  onPress={() => shareLocation(contact)}
                >
                  <View style={styles.contactSelectInfo}>
                    <View style={styles.contactIconContainer}>
                      <FontAwesome5 name="user-shield" size={24} color="#3D212B" />
                    </View>
                    <View style={styles.contactDetails}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactNumber}>{contact.phone}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Placeholder screens for other tabs
const AlertsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    registerForPushNotifications();
    loadNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow notifications for safety alerts');
        return;
      }

      // Set up notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      let notifs = [];
      if (storedNotifications) {
        notifs = JSON.parse(storedNotifications);
      }
      // Add some default notifications if none exist
      if (notifs.length === 0) {
        notifs = [
          {
            id: '1',
            title: 'Welcome to SheShield',
            body: 'Stay safe with our emergency features. Add emergency contacts to get started.',
            type: 'tip',
            time: 'Just now'
          }
        ];
        await AsyncStorage.setItem('notifications', JSON.stringify(notifs));
      }
      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'location_share':
        return 'share-alt';
      case 'emergency':
        return 'exclamation-circle';
      case 'reminder':
        return 'clock';
      case 'tip':
        return 'lightbulb';
      default:
        return 'bell';
    }
  };

  return (
    <View style={styles.alertsContainer}>
      <View style={styles.alertsHeader}>
        <Text style={styles.alertsTitle}>Safety Alerts</Text>
        <View style={styles.alertsIcon}>
          <FontAwesome5 name="bell" size={24} color="#3D212B" />
        </View>
      </View>

      <ScrollView 
        style={styles.alertsList}
        contentContainerStyle={styles.alertsListContent}
      >
        {notifications.length === 0 ? (
          <View style={styles.noAlertsContainer}>
            <FontAwesome5 name="bell-slash" size={40} color="#3D212B" />
            <Text style={styles.noAlertsText}>No alerts yet</Text>
            <Text style={styles.noAlertsSubtext}>
              Notifications about your safety activities will appear here
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <View key={notification.id} style={styles.alertCard}>
              <View style={styles.alertIconContainer}>
                <FontAwesome5 
                  name={getNotificationIcon(notification.type)} 
                  size={24} 
                  color="#3D212B" 
                />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{notification.title}</Text>
                <Text style={styles.alertMessage}>{notification.body}</Text>
                <Text style={styles.alertTime}>{notification.time}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const ContactsScreen = () => {
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [deviceContacts, setDeviceContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts = async () => {
    try {
      const contacts = await AsyncStorage.getItem('emergencyContacts');
      if (contacts) {
        setEmergencyContacts(JSON.parse(contacts));
      }
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    }
  };

  const saveEmergencyContacts = async (contacts) => {
    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
    }
  };

  const loadDeviceContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        setDeviceContacts(data.filter(contact => contact.phoneNumbers?.length > 0));
      }
    } catch (error) {
      console.error('Error loading device contacts:', error);
    }
  };

  const addEmergencyContact = (contact) => {
    const newContact = {
      id: contact.id,
      name: contact.name,
      phoneNumber: contact.phoneNumbers[0].number,
    };
    const updatedContacts = [...emergencyContacts, newContact];
    setEmergencyContacts(updatedContacts);
    saveEmergencyContacts(updatedContacts);
    setIsAddingContact(false);
  };

  const removeEmergencyContact = (contactId) => {
    const updatedContacts = emergencyContacts.filter(contact => contact.id !== contactId);
    setEmergencyContacts(updatedContacts);
    saveEmergencyContacts(updatedContacts);
  };

  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const filteredContacts = deviceContacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.contactsContainer}>
      <View style={styles.contactsHeader}>
        <Text style={styles.contactsTitle}>Emergency Contacts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setIsAddingContact(true);
            loadDeviceContacts();
          }}
        >
          <FontAwesome5 name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Emergency Contacts List */}
      <ScrollView style={styles.contactsList}>
        {emergencyContacts.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <View style={styles.contactIconContainer}>
                <FontAwesome5 name="user-shield" size={24} color="#3D212B" />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.phoneNumber}</Text>
              </View>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.callButton]}
                onPress={() => makeCall(contact.phoneNumber)}
              >
                <FontAwesome5 name="phone" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.removeButton]}
                onPress={() => removeEmergencyContact(contact.id)}
              >
                <FontAwesome5 name="trash" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal
        visible={isAddingContact}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddingContact(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Emergency Contact</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsAddingContact(false)}
              >
                <FontAwesome5 name="times" size={20} color="#3D212B" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666"
            />

            <ScrollView style={styles.deviceContactsList}>
              {filteredContacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.deviceContactItem}
                  onPress={() => addEmergencyContact(contact)}
                >
                  <FontAwesome5 name="user" size={20} color="#3D212B" />
                  <View style={styles.deviceContactInfo}>
                    <Text style={styles.deviceContactName}>{contact.name}</Text>
                    <Text style={styles.deviceContactNumber}>
                      {contact.phoneNumbers[0].number}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    ],
    communityPosts: [
      {
        id: '1',
        message: "I experienced cyberstalking and reported it to cyber cell. They were very helpful and took immediate action. Don't hesitate to report!",
        timestamp: "2 hours ago",
        reactions: 5
      },
      {
        id: '2',
        message: "Someone tried to hack my social media. Enable two-factor authentication, it really helps! Stay safe everyone.",
        timestamp: "1 day ago",
        reactions: 8
      },
      {
        id: '3',
        message: "Remember to regularly check your privacy settings on all social media platforms. I found out my photos were public without realizing it.",
        timestamp: "2 days ago",
        reactions: 12
      }
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
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(content.communityPosts || []);

  const addPost = () => {
    if (newPost.trim()) {
      const newPostObj = {
        id: Date.now().toString(),
        message: newPost,
        timestamp: 'Just now',
        reactions: 0
      };
      setPosts([newPostObj, ...posts]);
      setNewPost('');
    }
  };

  const addReaction = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, reactions: post.reactions + 1 }
        : post
    ));
  };

  const renderCommunitySection = () => {
    if (title !== 'Women Safety Online') return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Support</Text>
        <Text style={styles.communityDescription}>
          Share your experiences anonymously and support others. Your story might help someone stay safe.
        </Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Share your experience anonymously..."
            placeholderTextColor="#666"
            multiline
            value={newPost}
            onChangeText={setNewPost}
          />
          <TouchableOpacity 
            style={[styles.shareButton, !newPost.trim() && styles.shareButtonDisabled]}
            onPress={addPost}
            disabled={!newPost.trim()}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postsContainer}>
          {posts.map(post => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.postMessage}>{post.message}</Text>
              <View style={styles.postFooter}>
                <Text style={styles.timestamp}>{post.timestamp}</Text>
                <TouchableOpacity 
                  style={styles.reactionButton}
                  onPress={() => addReaction(post.id)}
                >
                  <FontAwesome5 name="heart" size={16} color="#3D212B" />
                  <Text style={styles.reactionCount}>{post.reactions}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.safetyDetailContainer}
    >
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

        {renderCommunitySection()}
      </ScrollView>
    </KeyboardAvoidingView>
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
      <ScrollView 
        style={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
      >
        {safetyCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryButton}
            onPress={() => navigation.navigate('SafetyDetail', { title: category.title })}
          >
            <View style={styles.categoryContent}>
              <View style={styles.categoryIconContainer}>
                <FontAwesome5 name={category.icon} size={24} color="#FFF" />
              </View>
              <Text style={styles.categoryText}>{category.title}</Text>
            </View>
            <View style={styles.categoryArrow}>
              <FontAwesome5 name="chevron-right" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const ProfileSection = ({ title, children }) => (
  <View style={styles.profileSection}>
    <Text style={styles.profileSectionTitle}>{title}</Text>
    {children}
  </View>
);

const ProfileIcon = ({ color, size, focused }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    loadProfilePhoto();
  }, []);

  const loadProfilePhoto = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        const { photo } = JSON.parse(profileData);
        setProfilePhoto(photo);
      }
    } catch (error) {
      console.error('Error loading profile photo:', error);
    }
  };

  if (profilePhoto) {
    return (
      <Image
        source={{ uri: profilePhoto }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: focused ? 2 : 0,
          borderColor: color
        }}
      />
    );
  }

  return <FontAwesome5 name="user" size={size} color={color} />;
};

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: '1', name: 'Mom', phone: '', relation: 'Mother' },
    { id: '2', name: 'Dad', phone: '', relation: 'Father' },
    { id: '3', name: 'Sister', phone: '', relation: 'Sister' }
  ]);
  const [homeAddress, setHomeAddress] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [medicalInfo, setMedicalInfo] = useState({
    bloodGroup: '',
    allergies: '',
    medications: '',
  });
  const [safetyPreferences, setSafetyPreferences] = useState({
    locationSharing: true,
    autoAlert: true,
    biometricLock: true,
    safetyReminders: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        const {
          name,
          photo,
          emergencyContacts,
          homeAddress,
          workAddress,
          medicalInfo,
          safetyPreferences
        } = JSON.parse(profileData);

        setName(name || '');
        setPhoto(photo || null);
        setEmergencyContacts(emergencyContacts || []);
        setHomeAddress(homeAddress || '');
        setWorkAddress(workAddress || '');
        setMedicalInfo(medicalInfo || {
          bloodGroup: '',
          allergies: '',
          medications: '',
        });
        setSafetyPreferences(safetyPreferences || {
          locationSharing: true,
          autoAlert: true,
          biometricLock: true,
          safetyReminders: true
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const saveProfile = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }

      const profileData = {
        name,
        photo,
        emergencyContacts,
        homeAddress,
        workAddress,
        medicalInfo,
        safetyPreferences
      };

      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
      await AsyncStorage.setItem('profileUpdateTime', Date.now().toString());
      Alert.alert('Success', 'Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3D212B" />
      </View>
    );
  }

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileTitle}>Safety Profile</Text>
        <FontAwesome5 name="shield-alt" size={24} color="#3D212B" />
      </View>

      <ScrollView 
        style={styles.profileContent}
        contentContainerStyle={styles.profileContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <FontAwesome5 name="user" size={40} color="#3D212B" />
              </View>
            )}
            <View style={styles.editPhotoButton}>
              <FontAwesome5 name="camera" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        <ProfileSection title="Personal Information">
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
            />
          </View>
        </ProfileSection>

        <ProfileSection title="Emergency Contacts">
          {emergencyContacts.map((contact) => (
            <View key={contact.id} style={styles.contactInput}>
              <View style={styles.contactHeader}>
                <FontAwesome5 name="user-shield" size={16} color="#3D212B" />
                <Text style={styles.contactTitle}>{contact.relation}</Text>
              </View>
              <TextInput
                style={styles.input}
                value={contact.phone}
                onChangeText={(text) => {
                  setEmergencyContacts(emergencyContacts.map(c =>
                    c.id === contact.id ? { ...c, phone: text } : c
                  ));
                }}
                placeholder={`Enter ${contact.name}'s phone number`}
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
            </View>
          ))}
        </ProfileSection>

        <ProfileSection title="Important Locations">
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Home Address</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={homeAddress}
              onChangeText={setHomeAddress}
              placeholder="Enter your home address"
              placeholderTextColor="#666"
              multiline
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Work/College Address</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={workAddress}
              onChangeText={setWorkAddress}
              placeholder="Enter your work/college address"
              placeholderTextColor="#666"
              multiline
            />
          </View>
        </ProfileSection>

        <ProfileSection title="Medical Information">
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Blood Group</Text>
            <TextInput
              style={styles.input}
              value={medicalInfo.bloodGroup}
              onChangeText={(text) => setMedicalInfo({ ...medicalInfo, bloodGroup: text })}
              placeholder="Enter your blood group"
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Allergies</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={medicalInfo.allergies}
              onChangeText={(text) => setMedicalInfo({ ...medicalInfo, allergies: text })}
              placeholder="List any allergies (if any)"
              placeholderTextColor="#666"
              multiline
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Medications</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={medicalInfo.medications}
              onChangeText={(text) => setMedicalInfo({ ...medicalInfo, medications: text })}
              placeholder="List any current medications (if any)"
              placeholderTextColor="#666"
              multiline
            />
          </View>
        </ProfileSection>

        <ProfileSection title="Safety Preferences">
          <View style={styles.toggleContainer}>
            <View style={styles.toggleItem}>
              <Text style={styles.toggleLabel}>Location Sharing</Text>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  safetyPreferences.locationSharing && styles.toggleActive
                ]}
                onPress={() => setSafetyPreferences({
                  ...safetyPreferences,
                  locationSharing: !safetyPreferences.locationSharing
                })}
              >
                <View style={[
                  styles.toggleCircle,
                  safetyPreferences.locationSharing && styles.toggleCircleActive
                ]} />
              </TouchableOpacity>
            </View>
            <View style={styles.toggleItem}>
              <Text style={styles.toggleLabel}>Automatic Emergency Alerts</Text>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  safetyPreferences.autoAlert && styles.toggleActive
                ]}
                onPress={() => setSafetyPreferences({
                  ...safetyPreferences,
                  autoAlert: !safetyPreferences.autoAlert
                })}
              >
                <View style={[
                  styles.toggleCircle,
                  safetyPreferences.autoAlert && styles.toggleCircleActive
                ]} />
              </TouchableOpacity>
            </View>
            <View style={styles.toggleItem}>
              <Text style={styles.toggleLabel}>Biometric Lock</Text>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  safetyPreferences.biometricLock && styles.toggleActive
                ]}
                onPress={() => setSafetyPreferences({
                  ...safetyPreferences,
                  biometricLock: !safetyPreferences.biometricLock
                })}
              >
                <View style={[
                  styles.toggleCircle,
                  safetyPreferences.biometricLock && styles.toggleCircleActive
                ]} />
              </TouchableOpacity>
            </View>
            <View style={styles.toggleItem}>
              <Text style={styles.toggleLabel}>Safety Reminders</Text>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  safetyPreferences.safetyReminders && styles.toggleActive
                ]}
                onPress={() => setSafetyPreferences({
                  ...safetyPreferences,
                  safetyReminders: !safetyPreferences.safetyReminders
                })}
              >
                <View style={[
                  styles.toggleCircle,
                  safetyPreferences.safetyReminders && styles.toggleCircleActive
                ]} />
              </TouchableOpacity>
            </View>
          </View>
        </ProfileSection>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

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

const CommunityForumPopup = ({ isVisible, onClose }) => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    {
      id: '1',
      message: "I experienced cyberstalking and reported it to cyber cell. They were very helpful and took immediate action. Don't hesitate to report!",
      timestamp: "2 hours ago",
      reactions: 5
    },
    {
      id: '2',
      message: "Someone tried to hack my social media. Enable two-factor authentication, it really helps! Stay safe everyone.",
      timestamp: "1 day ago",
      reactions: 8
    },
    {
      id: '3',
      message: "Remember to regularly check your privacy settings on all social media platforms. I found out my photos were public without realizing it.",
      timestamp: "2 days ago",
      reactions: 12
    }
  ]);

  const addPost = () => {
    if (newPost.trim()) {
      const newPostObj = {
        id: Date.now().toString(),
        message: newPost,
        timestamp: 'Just now',
        reactions: 0
      };
      setPosts([newPostObj, ...posts]);
      setNewPost('');
    }
  };

  const addReaction = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, reactions: post.reactions + 1 }
        : post
    ));
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Community Forum</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} color="#3D212B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.communityDescription}>
            Share your experiences anonymously and support others. Your story might help someone stay safe.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Share your experience anonymously..."
              placeholderTextColor="#666"
              multiline
              value={newPost}
              onChangeText={setNewPost}
            />
            <TouchableOpacity 
              style={[styles.shareButton, !newPost.trim() && styles.shareButtonDisabled]}
              onPress={addPost}
              disabled={!newPost.trim()}
            >
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.postsContainer}>
            {posts.map(post => (
              <View key={post.id} style={styles.postCard}>
                <Text style={styles.postMessage}>{post.message}</Text>
                <View style={styles.postFooter}>
                  <Text style={styles.timestamp}>{post.timestamp}</Text>
                  <TouchableOpacity 
                    style={styles.reactionButton}
                    onPress={() => addReaction(post.id)}
                  >
                    <FontAwesome5 name="heart" size={16} color="#3D212B" />
                    <Text style={styles.reactionCount}>{post.reactions}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const FloatingChatButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.floatingButton}
      onPress={onPress}
    >
      <View style={styles.floatingButtonInner}>
        <FontAwesome5 name="comments" size={24} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
};

const MainScreen = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
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
            tabBarIcon: ({ color, size, focused }) => (
              <ProfileIcon color={color} size={size} focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
      <FloatingChatButton onPress={() => setIsChatVisible(true)} />
      <CommunityForumPopup 
        isVisible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
      />
    </View>
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
    backgroundColor: '#FFF5EB',
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    overflow: 'hidden',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryText: {
    flex: 1,
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  categoryArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    color: '#3D212B',
  },
  communityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#3D212B20',
    color: '#3D212B',
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  shareButton: {
    backgroundColor: '#3D212B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  shareButtonDisabled: {
    backgroundColor: '#3D212B80',
  },
  shareButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  postsContainer: {
    gap: 12,
  },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3D212B20',
  },
  postMessage: {
    fontSize: 14,
    color: '#3D212B',
    lineHeight: 20,
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  reactionCount: {
    fontSize: 14,
    color: '#3D212B',
    marginLeft: 4,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3D212B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  floatingButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3D212B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF5EB',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3D212B20',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D212B',
  },
  closeButton: {
    padding: 8,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#FFF5EB',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D212B',
  },
  profileContent: {
    flex: 1,
  },
  profileContentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  profileSection: {
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
  profileSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D212B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3D212B20',
    color: '#3D212B',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  contactInput: {
    marginBottom: 16,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D212B',
    marginLeft: 8,
  },
  toggleContainer: {
    gap: 16,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#3D212B',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3D212B40',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#3D212B',
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF',
  },
  toggleCircleActive: {
    transform: [{ translateX: 20 }],
  },
  saveButton: {
    backgroundColor: '#3D212B',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoButton: {
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#3D212B',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3D212B',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3D212B',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  contactsContainer: {
    flex: 1,
    backgroundColor: '#FFF5EB',
  },
  contactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
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
  contactsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D212B',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3D212B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactsList: {
    flex: 1,
    padding: 16,
  },
  contactCard: {
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
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D212B',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#3D212B',
  },
  removeButton: {
    backgroundColor: '#FF4444',
  },
  emergencyButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  emergencyButton: {
    width: '100%',
    height: 120,
    backgroundColor: '#FF0000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  emergencyButtonDisabled: {
    backgroundColor: '#FF000080',
  },
  emergencyButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emergencyButtonSubtext: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  shareLocationIcon: {
    position: 'absolute',
    left: 20,
    bottom: 120,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  shareLocationIconDisabled: {
    backgroundColor: '#FF444480',
  },
  modalDescription: {
    fontSize: 16,
    color: '#3D212B',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  contactSelectCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contactSelectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertsContainer: {
    flex: 1,
    backgroundColor: '#FFF5EB',
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
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
  alertsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3D212B',
  },
  alertsIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#FFF5EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertsList: {
    flex: 1,
  },
  alertsListContent: {
    padding: 16,
    paddingBottom: 100,
  },
  noAlertsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  noAlertsText: {
    fontSize: 20,
    color: '#3D212B',
    marginTop: 16,
    fontWeight: 'bold',
  },
  noAlertsSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  alertCard: {
    flexDirection: 'row',
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
  alertIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D212B',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default MainScreen; 