import "../../global.css";

import { configureNotificationHandling } from "@/utils/index";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { router, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    configureNotificationHandling();

    const notificationSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const route = response.notification.request.content.data?.route;

        if (typeof route === "string") {
          router.push(route as never);
        }
      });

    return () => {
      notificationSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
