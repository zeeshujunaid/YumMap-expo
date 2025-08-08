import React, { useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  Animated,
  StyleSheet,
  StatusBar,
} from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Utils/Firebase";
import { RestaurantContext } from "../context/Restaurantcontext";

export default function Index() {
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(1.8)).current;
  const { setrestaurantdata } = useContext(RestaurantContext);

  // ✅ Fetch restaurant data
  const fetchRestaurantData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Resturantdata"));
      const restaurants = [];
      querySnapshot.forEach((doc) =>
        restaurants.push({ id: doc.id, ...doc.data() })
      );

      setrestaurantdata(restaurants);

      console.log("🍽️ Restaurant data fetched:", restaurants);
    } catch (error) {
      console.error("❌ Error fetching restaurant data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch restaurant data.",
      });
    }
  };

  // ✅ Auth check + navigate
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await fetchRestaurantData();

      if (user) {
        console.log("✅ User signed in:", user);
        Toast.show({
          type: "success",
          text1: "Welcome back!",
          text2: `Hello, ${user.name || "User"}!`,
        });
        router.replace("/(tabs)/Homescreen");
      } else {
        console.log("🚫 No user signed in.");
        Toast.show({
          type: "info",
          text1: "Please sign in",
          text2: "Redirecting to login...",
        });
        router.replace("/(auth)/Login");
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Logo animation
  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/yummapbg2.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar hidden />
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Animated.Image
          source={require("../assets/images/YumMap.png")}
          style={[styles.logo, { transform: [{ scale: logoScale }] }]}
        />
        <Text style={styles.title}>Welcome To</Text>
        <Text style={styles.subtitle}>A Food Discovery App!</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 240,
    marginBottom: 30,
  },
  title: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#fae7c1",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
});
