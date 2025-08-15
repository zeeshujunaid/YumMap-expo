import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { RestaurantContext } from "../../context/Restaurantcontext";
import { Ionicons } from "@expo/vector-icons"; // Make sure to import this

const minimalMapStyle = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  { featureType: "administrative", stylers: [{ visibility: "on" }] },
  { featureType: "road", stylers: [{ visibility: "on" }] },
  { featureType: "poi", stylers: [{ visibility: "on" }] },
  { featureType: "transit", stylers: [{ visibility: "on" }] },
  { featureType: "water", stylers: [{ visibility: "on" }] },
  { featureType: "landscape", stylers: [{ color: "#ffffff" }] },
];

export default function HomeScreen() {
  const { restaurantData } = useContext(RestaurantContext);

  const [location, setLocation] = useState(null);
  const [restaurantsWithCoords, setRestaurantsWithCoords] = useState([]);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 24.8607,
    longitude: 67.0011,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const mapRef = useRef(null);

  // ✅ New reusable function
  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(coords);

      // Zoom map to new location
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...coords,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000
        );
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (!restaurantData) return;

    (async () => {
      const updatedRestaurants = await Promise.all(
        restaurantData.map(async (rest) => {
          if (
            rest.location &&
            !isNaN(parseFloat(rest.location.latitude)) &&
            !isNaN(parseFloat(rest.location.longitude))
          ) {
            return rest;
          }

          if (rest.location?.address) {
            try {
              const geocoded = await Location.geocodeAsync(
                rest.location.address
              );
              if (geocoded.length > 0) {
                return {
                  ...rest,
                  location: {
                    ...rest.location,
                    latitude: geocoded[0].latitude,
                    longitude: geocoded[0].longitude,
                  },
                };
              }
            } catch (error) {
              console.warn("Geocoding failed for:", rest.name, error);
            }
          }
          return rest;
        })
      );

      setRestaurantsWithCoords(updatedRestaurants);
    })();
  }, [restaurantData]);

  useEffect(() => {
    if (!mapRef.current || !location || restaurantsWithCoords.length === 0)
      return;

    const validRestaurants = restaurantsWithCoords.filter(
      (rest) =>
        rest.location &&
        !isNaN(parseFloat(rest.location.latitude)) &&
        !isNaN(parseFloat(rest.location.longitude))
    );

    if (validRestaurants.length > 0) {
      const coords = [
        location,
        ...validRestaurants.map((rest) => ({
          latitude: parseFloat(rest.location.latitude),
          longitude: parseFloat(rest.location.longitude),
        })),
      ];

      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  }, [location, restaurantsWithCoords]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        customMapStyle={minimalMapStyle}
        showsUserLocation={false}
      >
        {restaurantsWithCoords
          ?.filter(
            (rest) =>
              rest.location &&
              !isNaN(parseFloat(rest.location.latitude)) &&
              !isNaN(parseFloat(rest.location.longitude))
          )
          .map((rest) => (
            <Marker
              key={rest.id}
              coordinate={{
                latitude: parseFloat(rest.location.latitude),
                longitude: parseFloat(rest.location.longitude),
              }}
            >
              <View style={styles.markerContainer}>
                <Image
                  source={{ uri: rest.imageUrl }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
              </View>
            </Marker>
          ))}

        {location && (
          <Marker
            coordinate={location}
            title="You are here"
            description="This is your current location"
          >
            <View style={{ alignItems: "center" }}>
              {/* Picture above the default red pin */}
              <Image
                source={{
                  uri: "https://i.pinimg.com/originals/c8/0d/5a/c80d5a2d2e1504e84a9d98f3cb825442.gif",
                }}
                style={{ width: 60, height: 60, marginBottom: 5 }}
              />
              {/* Default red pin will render automatically because no custom image is passed */}
              <Ionicons name="location-sharp" size={10} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Floating button */}
      <TouchableOpacity style={styles.locationButton} onPress={fetchLocation}>
        <Ionicons name="locate" size={26} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  markerContainer: {
    // alignItems: "center",
    // backgroundColor: "#000",
  },

  bubble: {
    justifyContent: "center",
    height: "100%",
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    // borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },

  name: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#222",
    flexShrink: 1, // allows text to shrink if needed but no cut
  },

  phone: {
    fontSize: 12,
    color: "#555",
    flexShrink: 1,
  },

  arrow: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    width: 12,
    height: 12,
    transform: [{ rotate: "45deg" }],
    marginTop: -6,
  },

  arrowBorder: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    width: 14,
    height: 14,
    backgroundColor: "transparent",
  },
  locationButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
