import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#8e8e8e',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Homescreen') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Scanner') iconName = focused ? 'qr-code' : 'qr-code-outline';
          else if (route.name === 'Profilescreen') iconName = focused ? 'person' : 'person-outline';

          return (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name={iconName} size={24} color={color} />
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => {
          return (
            <View style={[styles.labelContainer, focused && styles.activeLabelContainer]}>
              <Text style={{ color, fontWeight: focused ? '700' : '500', fontSize: 12 }}>
                {route.name === 'Homescreen' ? 'Home' : route.name === 'Scanner' ? 'Scan' : 'Profile'}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="Homescreen" />
      <Tabs.Screen name="Scanner" />
      <Tabs.Screen name="Profilescreen" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 10,
    paddingHorizontal: 10,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 25,
  },
  activeIconContainer: {
    backgroundColor: '#D0F0C0', // subtle green highlight behind icon
  },
  labelContainer: {
    marginTop: 4,
  },
  activeLabelContainer: {
    // you can add styles here if needed for active label
  },
});
