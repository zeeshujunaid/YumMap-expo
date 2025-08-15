import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          color: '#6a6a6a',
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarActiveTintColor: '#40cf47',
        tabBarInactiveTintColor: '#A4D7A6',
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="Homescreen"
        options={{
          tabBarIcon: ({ color }) => (
            // <Ionicons name="home" size={24} color={color} />
            <MaterialIcons name="home-filled" size={24} color="black" />
          ),
          tabBarLabel: 'Home',
        }}
      />

      {/* Live Quiz Tab (Custom Center Button) */}
      <Tabs.Screen
        name="Scannerscreen"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.centerButton,
                { backgroundColor: focused ? '#66BB6A' : '#4CAF50' },
              ]}
            >
              {/* <Ionicons name="scan" size={28} color="white" /> */}
              <MaterialIcons name="qr-code-scanner" size={24} color="black" />
            </View>
          ),
          tabBarLabel: 'Live Quiz',
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="Profilescreen"
        options={{
          tabBarIcon: ({ color }) => (
            // <Ionicons name="person" size={24} color={color} />
            <MaterialIcons name="person-2" size={24} color="black" />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: '70%',
    transform: [{ translateX: -35 }],
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
});
