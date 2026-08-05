import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

import { AsyncState } from "@/components/ui/AsyncState";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { HadithService } from "@/services/ummah/hadits";

type Collection = { key: string; name: string; arabic_name: string; author: string; reliability: string; total_hadiths: number };
type RandomHadith = { collection_name: string; arabic: string; english: string; grade: string };

export default function HadithScreen() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [random, setRandom] = useState<RandomHadith | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [collectionsRes, randomRes] = await Promise.all([HadithService.hadithCollections(), HadithService.randomHadith()]);
      const collectionsData = collectionsRes.data?.data?.collections ?? [];
      setCollections(Array.isArray(collectionsData) ? collectionsData : []);
      setRandom(randomRes.data?.data ?? null);
    } catch {
      setError("Couldn't load hadith collections.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScreenContainer className="px-0 py-0" edges={["left", "right", "bottom"]}>
      <AsyncState loading={loading} error={error} onRetry={load}>
        <FlatList
          data={collections}
          keyExtractor={(item) => item.key}
          contentContainerClassName="px-6 pt-4 pb-6 gap-3"
          ListHeaderComponent={
            random ? (
              <View className="mb-3 rounded-2xl bg-brand-50 dark:bg-brand-400/10 p-4">
                <Text className="text-xs font-medium text-brand-600 dark:text-brand-400">Hadith of the moment · {random.collection_name}</Text>
                <Text className="mt-2 text-right text-lg leading-8 text-slate-900 dark:text-white">{random.arabic}</Text>
                <Text className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{random.english}</Text>
                {random.grade ? <Text className="mt-2 text-xs text-slate-500 dark:text-slate-400">Grade: {random.grade}</Text> : null}
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <Link href={`/hadith/${item.key}`} asChild>
              <Pressable className="flex-row items-center justify-between rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4 active:opacity-70">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-semibold text-slate-900 dark:text-white">{item.name}</Text>
                  <Text className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {item.author} · {item.total_hadiths.toLocaleString()} hadiths
                  </Text>
                </View>
                <Text className="text-lg text-slate-700 dark:text-slate-300">{item.arabic_name}</Text>
              </Pressable>
            </Link>
          )}
        />
      </AsyncState>
    </ScreenContainer>
  );
}
