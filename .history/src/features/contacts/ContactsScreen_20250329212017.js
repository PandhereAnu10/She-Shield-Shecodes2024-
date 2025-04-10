import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { List, FAB, useTheme, Button, TextInput, Portal, Dialog } from 'react-native-paper';
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem('emergency_contacts');
      if (savedContacts) {
        setEmergencyContacts(JSON.parse(savedContacts));
      }
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    }
  };

  const saveEmergencyContacts = async (newContacts) => {
    try {
      await AsyncStorage.setItem('emergency_contacts', JSON.stringify(newContacts));
      setEmergencyContacts(newContacts);
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
    }
  };

  const handleAddContact = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        });

        if (data.length > 0) {
          setContacts(data);
          setVisible(true);
        }
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSelectContact = (contact) => {
    if (emergencyContacts.length >= 5) {
      Alert.alert('Limit Reached', 'You can only add up to 5 emergency contacts.');
      return;
    }

    const phoneNumber = contact.phoneNumbers?.[0]?.number;
    if (!phoneNumber) {
      Alert.alert('Invalid Contact', 'Selected contact does not have a phone number.');
      return;
    }

    const newContact = {
      id: contact.id,
      name: contact.name,
      phoneNumber,
    };

    saveEmergencyContacts([...emergencyContacts, newContact]);
    setVisible(false);
  };

  const handleRemoveContact = (contactId) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            const newContacts = emergencyContacts.filter(
              (contact) => contact.id !== contactId
            );
            saveEmergencyContacts(newContacts);
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={emergencyContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.phoneNumber}
            left={(props) => <List.Icon {...props} icon="account" />}
            right={(props) => (
              <Button
                {...props}
                icon="delete"
                onPress={() => handleRemoveContact(item.id)}
                color={theme.colors.error}
              />
            )}
          />
        )}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Select Contact</Dialog.Title>
          <Dialog.Content>
            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  description={item.phoneNumbers?.[0]?.number}
                  onPress={() => handleSelectContact(item)}
                />
              )}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        label="Add Contact"
        onPress={handleAddContact}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ContactsScreen; 