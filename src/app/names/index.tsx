import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

import { AsyncState } from "@/components/ui/AsyncState";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { NamesService } from "@/services/ummah/names";

type IslamicName = {
  id: number;
  name: string;
  arabic: string;
  meaning: string;
  origin: string;
};

export default function NamesScreen() {
  const [query, setQuery] = useState("");
  const [names, setNames] = useState<IslamicName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (search: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = search.trim() ? await NamesService.getSearchName(search.trim(), 30) : await NamesService.getAllNames();
      const data = response.data?.data?.names ?? [];
      setNames(Array.isArray(data) ? data : []);
    } catch {
      setError("Couldn't load Islamic names.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => load(query), 300);
    return () => clearTimeout(timeout);
  }, [query, load]);

  return (
    <ScreenContainer className="px-0 py-0" edges={["left", "right", "bottom"]}>
      <View className="px-6 pb-2 pt-4">
        <TextInput mode="outlined" placeholder="Search a name…" value={query} onChangeText={setQuery} />
      </View>

      <AsyncState loading={loading} error={error} onRetry={() => load(query)}>
        <FlatList
          data={names}
          keyExtractor={(item, index) => String(item.id ?? index)}
          contentContainerClassName="px-6 pb-6 gap-2"
          renderItem={({ item }) => (
            <View className="rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-slate-900 dark:text-white">{item.name}</Text>
                <Text className="text-lg text-slate-700 dark:text-slate-300">{item.arabic}</Text>
              </View>
              {item.meaning ? <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.meaning}</Text> : null}
              {item.origin ? <Text className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{item.origin}</Text> : null}
            </View>
          )}
        />
      </AsyncState>
    </ScreenContainer>
  );
}
