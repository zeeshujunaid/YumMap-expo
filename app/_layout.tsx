import 'react-native-gesture-handler';
import '../Utils/Firebase'

import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName='index' />
      <Toast />
    </GestureHandlerRootView>
  );
}
