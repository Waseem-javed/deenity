import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AdhanPlayer } from "@/components/AdhanPlayer";
import { QiblaAlignmentAlert } from "@/components/QiblaAlignmentAlert";
import { getThemePreference } from "@/lib/preferences";
import "../../global.css";

const lightTheme = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: "#0f8478" } };
const darkTheme = { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, primary: "#3bcab0" } };

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    getThemePreference().then((preference) => {
      if (preference) setColorScheme(preference);
    });
  }, [setColorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={isDark ? darkTheme : lightTheme}>
          <StatusBar style={isDark ? "light" : "dark"} />
          <AdhanPlayer />
          <QiblaAlignmentAlert />
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerStyle: { backgroundColor: isDark ? "#03100f" : "#f3fbf9" },
              headerTintColor: isDark ? "#3bcab0" : "#0f8478",
              headerTitleStyle: { fontWeight: "600", color: isDark ? "#ffffff" : "#0f172a" },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ title:'', headerShown: false }} />
            <Stack.Screen name="duas/index" options={{ title: "Duas" }} />
            <Stack.Screen name="asma/index" options={{ title: "99 Names" }} />
            <Stack.Screen name="names/index" options={{ title: "Islamic Names" }} />
            <Stack.Screen name="zakat/index" options={{ title: "Zakat Calculator" }} />
            <Stack.Screen name="hadith/index" options={{ title: "Hadith" }} />
          </Stack>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
