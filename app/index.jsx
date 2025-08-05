import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Animated,
  StyleSheet,
  StatusBar,
} from 'react-native';

export default function Index() {
  const logoScale = useRef(new Animated.Value(1.8)).current;

  // ✅ Animate logo scaling effect
  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/yummapbg2.png')} // Replace with your image
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar hidden={true} />

      <View style={styles.overlay} />

      <View style={styles.container}>
        <Animated.Image
          source={require('../assets/images/YumMap.png')} // Replace with your logo
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
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 240,
    marginBottom: 30,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#fae7c1',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
});
