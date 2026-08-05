import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { Link } from "expo-router";

import { AsyncState } from "@/components/ui/AsyncState";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { useTabBarClearance } from "@/hooks/useTabBarClearance";
import { QuranService } from "@/services/ummah/quran";

type Surah = {
  number: number;
  name_arabic: string;
  name_english: string;
  name_translation: string;
  verses_count: number;
  revelation_place: "makkah" | "madinah";
};

export default function QuranScreen() {
  const clearance = useTabBarClearance();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const response = await QuranService.ListSurahs();
      const surahs = response.data?.data?.surahs ?? [];
      setSurahs(Array.isArray(surahs) ? surahs : []);
    } catch {
      setError("Couldn't load the surah list.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScreenContainer className="px-0 py-0">
      <View className="px-6 pb-2 pt-6">
        <Text className="text-3xl font-semibold text-slate-900 dark:text-white">Quran</Text>
        <Text className="mt-1 text-base text-slate-600 dark:text-slate-300">114 surahs, with translation</Text>
      </View>

      <AsyncState loading={loading} error={error} onRetry={load}>
        <FlatList
          data={surahs}
          keyExtractor={(item) => String(item.number)}
          contentContainerClassName="px-6 gap-2"
          contentContainerStyle={{ paddingBottom: clearance }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load({ silent: true })} tintColor="#0f8478" />}
          renderItem={({ item }) => (
            <Link href={`/quran/${item.number}`} asChild>
              <Pressable className="flex-row items-center gap-4 rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4 active:opacity-70">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-400/15">
                  <Text className="font-semibold text-brand-600 dark:text-brand-400">{item.number}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-900 dark:text-white">{item.name_english}</Text>
                  <Text className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {item.name_translation} · {item.verses_count} verses
                  </Text>
                </View>
                <Text className="text-lg text-slate-700 dark:text-slate-300">{item.name_arabic}</Text>
              </Pressable>
            </Link>
          )}
        />
      </AsyncState>
    </ScreenContainer>
  );
}
