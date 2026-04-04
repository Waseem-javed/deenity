import "../../global.css";

import {
  configureNotificationHandling,
  registerNotificationResponseListener,
} from "@/utils/index";
import { useFonts } from "expo-font";
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
    let disposeNotificationListener = () => {};

    void (async () => {
      await configureNotificationHandling();
      disposeNotificationListener = await registerNotificationResponseListener(
        (route) => {
          router.push(route as never);
        },
      );
    })();

    return () => {
      disposeNotificationListener();
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
