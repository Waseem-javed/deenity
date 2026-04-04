import QuranReaderHeader from "@/components/quran/QuranReaderHeader";
import QuranPageCard from "@/components/quran/surah/SurahPage";
import { fetchJuzByNumber } from "@/services/quran/quranService";
import type { IJuzDetail } from "@/types/quran";
import {
  SafeAreaView,
  formatJuzLabel,
  groupAyahsByPage,
  loadAppSettings,
  normalizeRouteParam,
} from "@/utils/index";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const fontScaleMap = {
  small: 24,
  medium: 30,
  large: 36,
} as const;

const QuranParaScreen = () => {
  const params = useLocalSearchParams<{ para?: string }>();
  const paraParam = normalizeRouteParam(params.para);
  const paraNumber = Number(paraParam);

  const [para, setPara] = useState<IJuzDetail | null>(null);
  const [fontScale, setFontScale] =
    useState<keyof typeof fontScaleMap>("medium");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const arabicFontSize = useMemo(() => fontScaleMap[fontScale], [fontScale]);
  const pageGroups = useMemo(
    () => (para ? groupAyahsByPage(para.ayahs) : []),
    [para],
  );
  const pageBlockMinHeight = useMemo(
    () => Math.round(arabicFontSize * 1.9 * 16),
    [arabicFontSize],
  );
  const subtitle = useMemo(() => {
    if (!para?.ayahs.length) {
      return "Loading para details...";
    }

    const firstAyah = para.ayahs[0];
    const lastAyah = para.ayahs[para.ayahs.length - 1];

    if (firstAyah.surah.number === lastAyah.surah.number) {
      return `${firstAyah.surah.englishName} • Ayah ${firstAyah.numberInSurah}-${lastAyah.numberInSurah}`;
    }

    return `${firstAyah.surah.englishName} ${firstAyah.numberInSurah} to ${lastAyah.surah.englishName} ${lastAyah.numberInSurah}`;
  }, [para]);

  const loadPara = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const [detail, settings] = await Promise.all([
          fetchJuzByNumber(paraNumber),
          loadAppSettings(),
        ]);

        setPara(detail);
        setFontScale(settings.arabicFontScale);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this para right now.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [paraNumber],
  );

  useEffect(() => {
    if (!Number.isFinite(paraNumber) || paraNumber <= 0) {
      setError("This para route is invalid.");
      setLoading(false);
      return;
    }

    void loadPara();
  }, [loadPara, paraNumber]);

  return (
    <SafeAreaView className="flex-1 p-5 bg-[#14B8A6]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 32,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadPara(true)}
            tintColor="#14B8A6"
          />
        }
      >
        <QuranReaderHeader
          badge="Para Reader"
          title={para ? `Para ${para.number}` : `Para ${paraNumber || "--"}`}
          subtitle={subtitle}
          onBack={() => router.replace("/quran?tab=para")}
        />

        {loading ? (
          <View className="mt-6 items-center rounded-[28px] bg-white px-6 py-10">
            <ActivityIndicator size="large" color="#14B8A6" />
            <Text className="mt-4 text-sm text-slate-500">
              Loading para ayahs...
            </Text>
          </View>
        ) : error || !para ? (
          <View className="mt-6 rounded-[28px] border border-amber-200 bg-amber-50 p-5">
            <Text className="text-base font-semibold text-amber-800">
              Para unavailable
            </Text>
            <Text className="mt-2 text-sm leading-6 text-amber-700">
              {error ?? "The para data could not be loaded."}
            </Text>
            <TouchableOpacity
              onPress={() => void loadPara()}
              className="mt-4 self-start rounded-full bg-[#14B8A6] px-4 py-2"
            >
              <Text className="text-xs font-semibold text-white">
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mt-6">
            {pageGroups.map((page) => (
              <QuranPageCard
                key={page.pageNumber}
                pageNumber={page.pageNumber}
                juzLabel={formatJuzLabel(page.juzNumbers)}
                ayahs={page.ayahs}
                arabicFontSize={arabicFontSize}
                minHeight={pageBlockMinHeight}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuranParaScreen;
