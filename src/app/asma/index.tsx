import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { AsyncState } from "@/components/ui/AsyncState";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { AsmaService } from "@/services/ummah/asma";

type AllahName = {
  number: number;
  arabic: string;
  transliteration: string;
  english: string;
  meaning: string;
};

export default function AsmaScreen() {
  const [names, setNames] = useState<AllahName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AsmaService.getAllahNames();
      const data = response.data?.data?.names ?? [];
      setNames(Array.isArray(data) ? data : []);
    } catch {
      setError("Couldn't load the 99 Names.");
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
          data={names}
          keyExtractor={(item, index) => String(item.number ?? index)}
          numColumns={2}
          columnWrapperClassName="justify-between"
          contentContainerClassName="px-6 pt-4 pb-6 gap-3"
          renderItem={({ item, index }) => (
            <View className="mb-3 w-[48%] rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4">
              <Text className="text-xs font-medium text-brand-600 dark:text-brand-400">{item.number ?? index + 1}</Text>
              <Text className="mt-2 text-right text-2xl text-slate-900 dark:text-white">{item.arabic}</Text>
              <Text className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{item.transliteration}</Text>
              <Text className="text-xs text-slate-400 dark:text-slate-500">{item.english}</Text>
              {item.meaning ? (
                <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400" numberOfLines={2}>
                  {item.meaning}
                </Text>
              ) : null}
            </View>
          )}
        />
      </AsyncState>
    </ScreenContainer>
  );
}
