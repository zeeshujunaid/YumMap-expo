// components/LocationSelectorModal.js
import React, { useEffect, useState, useRef } from "react";
import { Modal, View, Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function LocationSelectorModal({ visible, onClose, onSelectLocation }) {
  const [location, setLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 24.8607,
    longitude: 67.0011,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const mapRef = useRef(null); // ✅ to control map programmatically

  useEffect(() => {
    if (!visible) return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setLocation(coords);
        setInitialRegion({
          ...coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // ✅ Move/Zoom map instantly to location
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              ...coords,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
          }
        }, 500);

      } else {
        setLocation(null);
        setInitialRegion({
          latitude: 24.8607,
          longitude: 67.0011,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, [visible]);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const handleConfirm = async () => {
    if (location && onSelectLocation) {
      try {
        const [address] = await Location.reverseGeocodeAsync(location);

        const fullAddress = `${address.name || ""} ${address.street || ""}, ${address.city || ""}, ${address.region || ""}, ${address.country || ""}`.trim();

        onSelectLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          address: fullAddress,
        });

        onClose();
      } catch (error) {
        console.error("Error getting address:", error);
        onSelectLocation(location);
        onClose();
      }
    }
  };

  // ✅ Get my exact location again
  const handleGetMyLocation = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setLocation(coords);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
      >
        {location && <Marker coordinate={location} />}
      </MapView>

      <View style={styles.controls}>
        <Button title="📍 Get My Location" onPress={handleGetMyLocation} color="#4CAF50" />
        <Button title="✅ Confirm Location" onPress={handleConfirm} color="#2196F3" />
        <Button title="❌ Cancel" onPress={onClose} color="#F44336" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#000000aa",
    padding: 15,
    borderRadius: 10,
    gap: 10,
    width: "90%",
  },
});
