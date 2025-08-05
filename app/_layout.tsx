import "react-native-gesture-handler";
import "../Utils/Firebase";

import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import { RestaurantProvider } from "@/context/Restaurantcontext";

export default function RootLayout() {
  useEffect(() => {
    const hideNavBar = async () => {
      try {
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("overlay-swipe");
        await NavigationBar.setBackgroundColorAsync("transparent");
      } catch (error) {
        console.log("Failed to hide nav bar:", error);
      }
    };

    hideNavBar();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RestaurantProvider>
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName="index"
        />
      </RestaurantProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}
