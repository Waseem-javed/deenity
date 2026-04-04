import QuranReaderHeader from "@/components/quran/QuranReaderHeader";
import QuranPageCard from "@/components/quran/surah/SurahPage";
import type { ParaDetail } from "@/types/quran";
import {
  SafeAreaView,
  buildQuranPageGroups,
  fetchParaDetail,
  getJuzLabel,
  loadAppSettings,
} from "@/utils/index";
import { Stack, router, useLocalSearchParams } from "expo-router";
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
  const paraNumber = Number(params.para);

  const [para, setPara] = useState<ParaDetail | null>(null);
  const [fontScale, setFontScale] =
    useState<keyof typeof fontScaleMap>("medium");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const arabicFontSize = useMemo(() => fontScaleMap[fontScale], [fontScale]);
  const pageGroups = useMemo(
    () =>
      para
        ? buildQuranPageGroups(
            para.ayahs.map((ayah) => ({
              ayahNumber: ayah.ayahNumber,
              numberInSurah: ayah.numberInSurah,
              arabicText: ayah.arabicText,
              translationText: ayah.translationText,
              juz: ayah.juz,
              page: ayah.page,
              surah: ayah.surah,
            })),
          )
        : [],
    [para],
  );
  const pageBlockMinHeight = useMemo(
    () => Math.round(arabicFontSize * 1.9 * 16),
    [arabicFontSize],
  );

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
          fetchParaDetail(paraNumber),
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
    <SafeAreaView className="flex-1 bg-[#F6FBFA]">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
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
          subtitle={
            para
              ? `${para.arabicName} • ${para.englishName}`
              : "Loading para details..."
          }
          onBack={() => router.back()}
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
          <>
            <View className="-mt-4 rounded-[28px] bg-white p-5 shadow-sm">
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-[#14B8A6]">
                Para overview
              </Text>
              <View className="mt-3 flex-row justify-between rounded-2xl bg-slate-900 px-4 py-3">
                <View>
                  <Text className="text-[11px] uppercase text-slate-400">
                    Ayahs
                  </Text>
                  <Text className="mt-1 text-lg font-bold text-white">
                    {para.ayahs.length}
                  </Text>
                </View>
                <View>
                  <Text className="text-[11px] uppercase text-slate-400">
                    Surahs
                  </Text>
                  <Text className="mt-1 text-lg font-bold text-white">
                    {para.surahNumbers.length}
                  </Text>
                </View>
                <View>
                  <Text className="text-[11px] uppercase text-slate-400">
                    Pages
                  </Text>
                  <Text className="mt-1 text-lg font-bold text-white">
                    {para.pageRange.start}-{para.pageRange.end}
                  </Text>
                </View>
              </View>

              <View className="mt-4 rounded-[24px] bg-slate-50 px-4 py-4">
                <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-400">
                  Coverage
                </Text>
                <Text className="mt-1 text-base font-bold text-slate-900">
                  {para.range}
                </Text>
                <Text className="mt-1 text-sm text-slate-500">
                  Arabic size {fontScale} • Juz {para.number}
                </Text>
              </View>
            </View>

            <View className="mt-6 gap-4">
              {pageGroups.map((page) => (
                <QuranPageCard
                  key={page.pageNumber}
                  pageNumber={page.pageNumber}
                  juzLabel={getJuzLabel(page.juzNumbers)}
                  arabicText={page.arabicText}
                  arabicFontSize={arabicFontSize}
                  translations={page.translations}
                  minHeight={pageBlockMinHeight}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuranParaScreen;
