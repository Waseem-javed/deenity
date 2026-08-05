import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { AsyncState } from "@/components/ui/AsyncState";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { HadithService } from "@/services/ummah/hadits";

type Hadith = { id: string; hadithnumber: number; arabic: string; english: string; grade?: string };

export default function HadithCollectionScreen() {
  const { collection } = useLocalSearchParams<{ collection: string }>();

  const [title, setTitle] = useState(collection);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await HadithService.browseHadith({ collection, page: 1, limit: 30 });
      const data = response.data?.data ?? {};
      setTitle(data.collection_name ?? collection);
      setHadiths(Array.isArray(data.hadiths) ? data.hadiths : []);
    } catch {
      setError("Couldn't load this collection.");
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScreenContainer className="px-0 py-0" edges={["left", "right", "bottom"]}>
      <Stack.Screen options={{ title }} />
      <AsyncState loading={loading} error={error} onRetry={load}>
        <FlatList
          data={hadiths}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-6 pt-4 pb-6 gap-3"
          renderItem={({ item }) => (
            <View className="rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4">
              <Text className="text-xs font-medium text-brand-600 dark:text-brand-400">Hadith {item.hadithnumber}</Text>
              <Text className="mt-2 text-right text-lg leading-8 text-slate-900 dark:text-white">{item.arabic}</Text>
              <Text className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{item.english}</Text>
              {item.grade ? <Text className="mt-2 text-xs text-slate-500 dark:text-slate-400">Grade: {item.grade}</Text> : null}
            </View>
          )}
        />
      </AsyncState>
    </ScreenContainer>
  );
}
