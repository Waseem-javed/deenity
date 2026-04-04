import ParaListCard from "@/components/quran/para/ParaListCard";
import QuranLibraryHeader from "@/components/quran/QuranLibraryHeader";
import QuranOverviewCards from "@/components/quran/QuranOverviewCards";
import QuranSegmentTabs from "@/components/quran/QuranSegmentTabs";
import SurahListCard from "@/components/quran/surah/SurahListCard";
import { fetchAllSurahs } from "@/services/quran/quranService";
import type { ISurah, QuranTab } from "@/types/quran";
import { SafeAreaView } from "@/utils/index";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const QuranIndex = () => {
  const [surahs, setSurahs] = useState<ISurah[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<QuranTab>("surah");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSurahs = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await fetchAllSurahs();
      setSurahs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the Quran library right now.",
      );
      setSurahs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadSurahs();
  }, [loadSurahs]);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredSurahs = useMemo(() => {
    if (!normalizedSearch) {
      return surahs;
    }

    return surahs.filter((surah) => {
      const searchableText = [
        surah.number.toString(),
        surah.name,
        surah.englishName,
        surah.englishNameTranslation,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [normalizedSearch, surahs]);

  const listData = activeTab === "surah" ? filteredSurahs : [];

  return (
    <SafeAreaView className="flex-1 p-5 bg-[#F6FBFA]">
      <QuranLibraryHeader
        search={search}
        onChangeSearch={setSearch}
        onBack={() => router.back()}
      />
      <QuranOverviewCards meccanCount={86} medinanCount={28} />

      <FlatList
        data={listData}
        key={activeTab}
        keyExtractor={(item) => `${activeTab}-${item.number}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 0, paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {!loading && !error ? (
              <>
                <View className="mt-6 mb-3 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-slate-900">
                    {activeTab === "surah" ? "All Surahs" : "All Paras"}
                  </Text>
                  <Text className="text-xs font-semibold uppercase tracking-[0.8px] text-slate-400">
                    {activeTab === "surah" ? "Tap to read" : "Tap to open"}
                  </Text>
                </View>
                <QuranSegmentTabs
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
              </>
            ) : null}
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadSurahs(true)}
            tintColor="#14B8A6"
          />
        }
        ListEmptyComponent={
          loading ? (
            <View className="mt-6 items-center rounded-[28px] bg-white px-6 py-10">
              <ActivityIndicator size="large" color="#14B8A6" />
              <Text className="mt-4 text-sm text-slate-500">
                Loading Quran library...
              </Text>
            </View>
          ) : error ? (
            <View className="mt-6 rounded-[28px] border border-amber-200 bg-amber-50 p-5">
              <Text className="text-base font-semibold text-amber-800">
                Quran unavailable
              </Text>
              <Text className="mt-2 text-sm leading-6 text-amber-700">
                {error}
              </Text>
              <TouchableOpacity
                onPress={() => void loadSurahs()}
                className="mt-4 self-start rounded-full bg-[#14B8A6] px-4 py-2"
              >
                <Text className="text-xs font-semibold text-white">
                  Try again
                </Text>
              </TouchableOpacity>
            </View>
          ) : listData.length === 0 ? (
            <View className="rounded-4xl border border-slate-200 bg-white p-5">
              <Text className="text-base font-semibold text-yellow-900">
                No {activeTab} found
              </Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                {activeTab === "surah"
                  ? "Try searching with a surah number or name."
                  : "Try searching with a para number, juz number, or para name."}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          return activeTab === "surah" ? (
            <SurahListCard
              surah={item}
              onPress={() => router.push(`/quran/${item.number}` as never)}
            />
          ) : (
            <ParaListCard
              para={item}
              onPress={() => router.push(`/quran/para/${1}` as never)}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default QuranIndex;
