import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

import { AsyncState } from "@/components/ui/AsyncState";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { DuaService } from "@/services/ummah/duas";

type Category = { id: string; name: string; description: string; count: number };

export default function DuasScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DuaService.getCategories();
      const data = response.data?.data?.categories ?? [];
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setError("Couldn't load dua categories.");
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
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-6 pt-4 pb-6 gap-2"
          renderItem={({ item }) => (
            <Link href={`/duas/${item.id}`} asChild>
              <Pressable className="flex-row items-center justify-between rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4 active:opacity-70">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-semibold text-slate-900 dark:text-white">{item.name}</Text>
                  <Text className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{item.description}</Text>
                </View>
                <View className="h-8 min-w-8 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-400/15 px-2">
                  <Text className="text-xs font-semibold text-brand-600 dark:text-brand-400">{item.count}</Text>
                </View>
              </Pressable>
            </Link>
          )}
        />
      </AsyncState>
    </ScreenContainer>
  );
}
