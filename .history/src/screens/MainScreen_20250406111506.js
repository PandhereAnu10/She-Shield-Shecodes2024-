import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';

const MainScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
            />
          </MapView>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => alert('Menu 1')}>
          <FontAwesome5 name="credit-card" size={24} color="#FF4B8C" />
          <Text style={styles.navText}>Menu 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => alert('Menu 2')}>
          <FontAwesome5 name="th" size={24} color="#FF4B8C" />
          <Text style={styles.navText}>Menu 2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.centerButton]} onPress={() => alert('Map')}>
          <View style={styles.mapButton}>
            <FontAwesome5 name="map-marked-alt" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => alert('Menu 4')}>
          <FontAwesome5 name="book" size={24} color="#FF4B8C" />
          <Text style={styles.navText}>Menu 4</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => alert('Menu 5')}>
          <FontAwesome5 name="user" size={24} color="#FF4B8C" />
          <Text style={styles.navText}>Menu 5</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    color: '#FF4B8C',
    fontSize: 12,
    marginTop: 4,
  },
  centerButton: {
    marginTop: -30,
  },
  mapButton: {
    backgroundColor: '#FF4B8C',
    width: 60,
    height: 60,
    borderRadius: 30,
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
});

export default MainScreen; 