// components/LocationSelectorModal.js
import React, { useEffect, useState } from "react";
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

  const handleConfirm = () => {
    if (location && onSelectLocation) {
      onSelectLocation(location);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}  // <-- free to move after initial load
        onPress={handleMapPress}
        showsUserLocation={true}       // Shows blue dot for current location
      >
        {location && <Marker coordinate={location} />}
      </MapView>

      <View style={styles.controls}>
        <Button title="✅ Confirm Location" onPress={handleConfirm} color="#fff" />
        <Button title="❌ Cancel" onPress={onClose} color="#ccc" />
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
