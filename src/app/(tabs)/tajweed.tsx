import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { QURAN_PARA_NAMES } from "@/constants/quranParaNames";
import { QURAN_TAJWEED_PARA_COUNT } from "@/constants/quranTajweedPages";
import { useTabBarClearance } from "@/hooks/useTabBarClearance";

const PARA_NUMBERS = Array.from({ length: QURAN_TAJWEED_PARA_COUNT }, (_, i) => i + 1);

export default function TajweedScreen() {
  const clearance = useTabBarClearance();

  return (
    <ScreenContainer className="px-0 py-0">
      <View className="px-6 pb-2 pt-6">
        <Text className="text-3xl font-semibold text-slate-900 dark:text-white">Tajweed Mushaf</Text>
        <Text className="mt-1 text-base text-slate-600 dark:text-slate-300">Offline, browse by Para</Text>
      </View>

      <FlatList
        data={PARA_NUMBERS}
        keyExtractor={(item) => String(item)}
        contentContainerClassName="px-6 gap-2"
        contentContainerStyle={{ paddingBottom: clearance }}
        renderItem={({ item }) => {
          const name = QURAN_PARA_NAMES[item];
          return (
            <Link href={`/tajweed/${item}`} asChild>
              <Pressable className="flex-row items-center gap-4 rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4 active:opacity-70">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-400/15">
                  <Text className="font-semibold text-brand-600 dark:text-brand-400">{item}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-900 dark:text-white">{name?.english ?? `Para ${item}`}</Text>
                  <Text className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Para {item}</Text>
                </View>
                <Text className="text-lg text-slate-700 dark:text-slate-300">{name?.arabic}</Text>
              </Pressable>
            </Link>
          );
        }}
      />
    </ScreenContainer>
  );
}
