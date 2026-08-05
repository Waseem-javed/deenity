import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { ScrollView, Text, View } from "react-native";
import { Button, SegmentedButtons, Switch } from "react-native-paper";

import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { useTabBarClearance } from "@/hooks/useTabBarClearance";
import { setHasOnboarded } from "@/lib/onboarding";
import {
  getMadhab,
  getSilentAdhan,
  setMadhab,
  setSilentAdhan,
  setThemePreference,
  type Madhab,
} from "@/lib/preferences";

export default function MoreScreen() {
  const clearance = useTabBarClearance();
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [madhab, setMadhabState] = useState<Madhab>("Shafi");
  const [silentAdhan, setSilentAdhanState] = useState(false);

  useEffect(() => {
    getMadhab().then(setMadhabState);
    getSilentAdhan().then(setSilentAdhanState);
  }, []);

  async function updateMadhab(value: Madhab) {
    setMadhabState(value);
    await setMadhab(value);
  }

  async function toggleSilentAdhan(value: boolean) {
    setSilentAdhanState(value);
    await setSilentAdhan(value);
  }

  async function toggleTheme(value: boolean) {
    const next = value ? "dark" : "light";
    setColorScheme(next);
    await setThemePreference(next);
  }

  async function replayOnboarding() {
    await setHasOnboarded(false);
    router.replace("/onboarding");
  }

  return (
    <ScreenContainer className="px-0 py-0">
      <ScrollView contentContainerClassName="px-6 pt-6 gap-6" contentContainerStyle={{ paddingBottom: clearance }} showsVerticalScrollIndicator={false}>
        <View>
          <Text className="text-3xl font-semibold text-slate-900 dark:text-white">More</Text>
          <Text className="mt-1 text-base text-slate-600 dark:text-slate-300">Preferences & about</Text>
        </View>

        <View className="rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4">
          <Text className="text-base font-semibold text-slate-900 dark:text-white">Asr calculation (madhab)</Text>
          <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">Affects when Asr prayer time is shown.</Text>
          <SegmentedButtons
            value={madhab}
            onValueChange={(value) => updateMadhab(value as Madhab)}
            style={{ marginTop: 12 }}
            buttons={[
              { value: "Shafi", label: "Shafi" },
              { value: "Hanafi", label: "Hanafi" },
            ]}
          />
        </View>

        <View className="rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-semibold text-slate-900 dark:text-white">Silent Adhan</Text>
              <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Prayer notifications still appear, without playing sound.
              </Text>
            </View>
            <Switch value={silentAdhan} onValueChange={toggleSilentAdhan} />
          </View>
        </View>

        <View className="rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-semibold text-slate-900 dark:text-white">Dark Mode</Text>
              <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">Switch the app&apos;s appearance.</Text>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        <View className="rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4">
          <Text className="text-base font-semibold text-slate-900 dark:text-white">Deenity</Text>
          <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">Version 1.0.0</Text>
          <Button mode="outlined" onPress={replayOnboarding} style={{ marginTop: 12 }} icon="restart">
            Replay welcome tour
          </Button>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
