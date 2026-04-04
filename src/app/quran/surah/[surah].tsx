import QuranReaderHeader from "@/components/quran/QuranReaderHeader";
import QuranPageCard from "@/components/quran/surah/SurahPage";
import { fetchSurahByNumber } from "@/services/quran/quranService";
import { ISurahDetail } from "@/types/quran";
import { SafeAreaView, groupAyahsByPage, normalizeRouteParam } from "@/utils";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const QuranSurahScreen = () => {
  const { surah } = useLocalSearchParams<{ surah: string }>();

  const [data, setData] = useState<ISurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const surahParam = normalizeRouteParam(surah);
  const surahNumber = Number(surahParam);

  const loadSurah = useCallback(async () => {
    if (
      !Number.isFinite(surahNumber) ||
      surahNumber <= 0 ||
      surahNumber > 114
    ) {
      setError("Invalid surah number.");
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetchSurahByNumber(surahNumber);
      setData(res);
    } catch (e) {
      setData(null);
      setError(
        e instanceof Error ? e.message : "Unable to load this surah right now.",
      );
    } finally {
      setLoading(false);
    }
  }, [surahNumber]);

  useEffect(() => {
    void loadSurah();
  }, [loadSurah]);

  const pages = useMemo(() => {
    if (!data?.ayahs) return [];
    return groupAyahsByPage(data.ayahs);
  }, [data]);

  return (
    <SafeAreaView className="flex-1 p-5 bg-[#0F766E]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 32,
        }}
      >
        <QuranReaderHeader
          badge="Surah Reader"
          title={data?.name ?? `Surah ${surahNumber || "--"}`}
          subtitle={
            data
              ? `${data.englishName} • ${data.englishNameTranslation} • ${data.numberOfAyahs} ayahs • ${data.revelationType}`
              : "Loading surah details..."
          }
          onBack={() => router.replace("/quran")}
        />

        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#fff" />
            <Text className="mt-3 text-white">Loading surah...</Text>
          </View>
        ) : error ? (
          <View className="mt-6 rounded-[28px] border border-amber-200 bg-amber-50 p-5">
            <Text className="text-base font-semibold text-amber-800">
              Surah unavailable
            </Text>
            <Text className="mt-2 text-sm leading-6 text-amber-700">
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => void loadSurah()}
              className="mt-4 self-start rounded-full bg-[#0F766E] px-4 py-2"
            >
              <Text className="text-xs font-semibold text-white">
                Refresh screen
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mt-6">
            {pages.map((page) => (
              <QuranPageCard
                key={page.pageNumber}
                juzNumbers={page.juzNumbers}
                pageNumber={page.pageNumber}
                ayahs={page.ayahs}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuranSurahScreen;
