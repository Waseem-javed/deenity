import QuranPageCard from "@/components/quran/surah/SurahPage";
import { fetchSurahByNumber } from "@/services/quran/quranService";
import { IAyah, ISurahDetail } from "@/types/quran";
import { SafeAreaView } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SurahPageGroup = {
  pageNumber: number;
  juzNumbers: number[];
  ayahs: IAyah[];
};

const ARABIC_FONT_SIZE = 30;
const PAGE_LINE_HEIGHT = Math.round(ARABIC_FONT_SIZE * 1.9);

const groupAyahsByPage = (ayahs: IAyah[]): SurahPageGroup[] => {
  const pages: Record<number, IAyah[]> = {};

  ayahs.forEach((ayah) => {
    const page = ayah.page;

    if (!pages[page]) {
      pages[page] = [];
    }

    pages[page].push(ayah);
  });

  return Object.keys(pages)
    .map((pageNumber) => {
      const pageAyahs = pages[Number(pageNumber)];

      return {
        pageNumber: Number(pageNumber),
        ayahs: pageAyahs,
        juzNumbers: [...new Set(pageAyahs.map((ayah) => ayah.juz))],
      };
    })
    .sort((a, b) => a.pageNumber - b.pageNumber);
};

const QuranSurahScreen = () => {
  const { surah } = useLocalSearchParams<{ surah: string }>();

  const [data, setData] = useState<ISurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const surahNumber = Number(surah);

  const loadSurah = useCallback(async () => {
    if (!Number.isFinite(surahNumber) || surahNumber <= 0) {
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
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-white/15"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <View className="rounded-full bg-emerald-300/20 px-4 py-2">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-white">
            Surah
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 5, paddingBottom: 40 }}
      >
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
          <>
            <View className="mb-5 rounded-[30px] bg-white px-5 py-6 shadow-sm">
              <Text className="text-center text-xs font-semibold uppercase tracking-[1px] text-[#0F766E]">
                Surah Reader
              </Text>
              <Text className="mt-3 text-lg font-bold text-center text-slate-900">
                {data?.englishName}
              </Text>
              <Text className="text-center text-3xl mt-2 text-slate-900">
                {data?.name}
              </Text>
              <Text className="mt-3 text-center text-sm leading-6 text-slate-500">
                {data?.englishNameTranslation} • {data?.numberOfAyahs} ayahs •{" "}
                {data?.revelationType}
              </Text>
            </View>

            {pages.map((page) => (
              <QuranPageCard
                key={page.pageNumber}
                juzNumbers={page.juzNumbers}
                pageNumber={page.pageNumber}
                ayahs={page.ayahs}
                arabicFontSize={ARABIC_FONT_SIZE}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuranSurahScreen;
