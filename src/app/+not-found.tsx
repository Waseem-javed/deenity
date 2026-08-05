import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Text } from "react-native";

import { ScreenContainer } from "@/components/ui/ScreenContainer";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not found" }} />
      <ScreenContainer className="items-center justify-center gap-2 px-6">
        <MaterialCommunityIcons name="compass-off-outline" size={40} color="#0f8478" />
        <Text className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">This screen doesn’t exist.</Text>
        <Link href="/" className="mt-2 text-base font-medium text-brand-600 dark:text-brand-400">
          Go to home
        </Link>
      </ScreenContainer>
    </>
  );
}
