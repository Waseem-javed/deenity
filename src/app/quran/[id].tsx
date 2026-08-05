import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { AsyncState } from "@/components/ui/AsyncState";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { QuranService } from "@/services/ummah/quran";

const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

type SurahMeta = {
  number: number;
  name_arabic: string;
  name_english: string;
  name_translation: string;
  verses_count: number;
  bismillah_pre: boolean;
};

type Reciter = { reciter_id: number; reciter: string; style: string; surah_audio: string };

type Ayah = { ayah: number; arabic: string; translation: string };

export default function SurahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahNumber = Number(id);

  const [surah, setSurah] = useState<SurahMeta | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [reciterId, setReciterId] = useState<number | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioUrl = reciters.find((r) => r.reciter_id === reciterId)?.surah_audio ?? null;
  const player = useAudioPlayer(audioUrl);
  const status = useAudioPlayerStatus(player);
  const shouldAutoPlay = useRef(false);

  useEffect(() => {
    if (audioUrl && shouldAutoPlay.current) {
      player.play();
    }
  }, [audioUrl, player]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const surahResponse = await QuranService.GetFullSurah(surahNumber);
      const meta: SurahMeta = surahResponse.data?.data?.surah;
      const audio: Reciter[] = surahResponse.data?.data?.audio ?? [];
      setSurah(meta);
      setReciters(audio);
      setReciterId(audio[0]?.reciter_id ?? null);

      const verseCount = meta?.verses_count ?? 0;
      const ayahResponses = await Promise.all(
        Array.from({ length: verseCount }, (_, i) => QuranService.GetSpecficAyah(surahNumber, i + 1)),
      );
      const verses = ayahResponses.map((response, index) => {
        const verse = response.data?.data?.verse ?? {};
        return {
          ayah: verse.ayah ?? index + 1,
          arabic: verse.arabic ?? "",
          translation: verse.translations?.sahih_international ?? "",
        };
      });
      setAyahs(verses);
    } catch {
      setError("Couldn't load this surah.");
    } finally {
      setLoading(false);
    }
  }, [surahNumber]);

  useEffect(() => {
    load();
  }, [load]);

  function selectReciter(id: number) {
    if (id === reciterId) return;
    shouldAutoPlay.current = true;
    setReciterId(id);
  }

  function togglePlayback() {
    if (status.playing) player.pause();
    else player.play();
  }

  return (
    <ScreenContainer className="px-0 py-0" edges={["left", "right", "bottom"]}>
      <Stack.Screen options={{ title: surah?.name_english ?? `Surah ${surahNumber}` }} />
      <View className="px-6 pb-2 pt-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-2xl font-semibold text-slate-900 dark:text-white">{surah?.name_english ?? `Surah ${surahNumber}`}</Text>
            {surah ? (
              <Text className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {surah.name_translation} · {surah.verses_count} verses
              </Text>
            ) : null}
          </View>
          <Pressable
            onPress={togglePlayback}
            disabled={!audioUrl}
            className="h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-400/15 active:opacity-70"
          >
            {!surah ? (
              <ActivityIndicator size="small" color="#0f8478" />
            ) : (
              <MaterialCommunityIcons name={status.playing ? "pause" : "play"} size={24} color="#0f8478" />
            )}
          </Pressable>
        </View>

        {reciters.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 -mx-1">
            {reciters.map((reciter) => {
              const selected = reciter.reciter_id === reciterId;
              return (
                <Pressable
                  key={reciter.reciter_id}
                  onPress={() => selectReciter(reciter.reciter_id)}
                  className={["mx-1 rounded-full px-3 py-1.5", selected ? "bg-brand-600" : "bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10"].join(" ")}
                >
                  <Text className={selected ? "text-sm font-medium text-white" : "text-sm font-medium text-slate-600 dark:text-slate-300"}>
                    {reciter.reciter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}
      </View>

      <AsyncState loading={loading} error={error} onRetry={load}>
        <FlatList
          data={ayahs}
          keyExtractor={(item) => String(item.ayah)}
          contentContainerClassName="px-6 pb-6 gap-3"
          ListHeaderComponent={
            surah?.bismillah_pre ? (
              <View className="mb-1 items-center rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 py-5">
                <Text className="text-2xl leading-10 text-slate-900 dark:text-white">{BISMILLAH}</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View className="rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-400/15">
                <Text className="text-xs font-semibold text-brand-600 dark:text-brand-400">{item.ayah}</Text>
              </View>
              <Text className="mt-2 text-right text-xl leading-9 text-slate-900 dark:text-white">{item.arabic}</Text>
              {item.translation ? <Text className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.translation}</Text> : null}
            </View>
          )}
        />
      </AsyncState>
    </ScreenContainer>
  );
}
