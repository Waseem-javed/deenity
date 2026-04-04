import ParaListCard from "@/components/quran/para/ParaListCard";
import QuranLibraryHeader from "@/components/quran/QuranLibraryHeader";
import QuranOverviewCards from "@/components/quran/QuranOverviewCards";
import QuranSegmentTabs from "@/components/quran/QuranSegmentTabs";
import SurahListCard from "@/components/quran/surah/SurahListCard";
import { fetchAllSurahs } from "@/services/quran/quranService";
import type { IParaListItem, ISurah, QuranTab } from "@/types/quran";
import { SafeAreaView, buildParaList } from "@/utils/index";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type QuranListItem = ISurah | IParaListItem;

const isParaListItem = (item: QuranListItem): item is IParaListItem => {
  return "arabicName" in item;
};

const QuranIndex = () => {
  const params = useLocalSearchParams<{ tab?: QuranTab | QuranTab[] }>();
  const initialTabParam = Array.isArray(params.tab)
    ? params.tab[0]
    : params.tab;
  const initialTab: QuranTab = initialTabParam === "para" ? "para" : "surah";
  const [surahs, setSurahs] = useState<ISurah[]>([]);
  const paras = useMemo<IParaListItem[]>(() => buildParaList(), []);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<QuranTab>(initialTab);
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

      const surahResponse = await fetchAllSurahs();

      setSurahs(Array.isArray(surahResponse.data) ? surahResponse.data : []);
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

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

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

  const filteredParas = useMemo(() => {
    if (!normalizedSearch) {
      return paras;
    }

    return paras.filter((para) => {
      const searchableText = [
        para.number.toString(),
        `juz ${para.number}`,
        `para ${para.number}`,
        para.arabicName,
        para.englishName,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [normalizedSearch, paras]);

  const listData: QuranListItem[] =
    activeTab === "surah" ? filteredSurahs : filteredParas;
  const renderItem: ListRenderItem<QuranListItem> = ({ item }) => {
    if (isParaListItem(item)) {
      return (
        <ParaListCard
          para={item}
          onPress={() => router.push(`/quran/para/${item.number}` as never)}
        />
      );
    }

    return (
      <SurahListCard
        surah={item}
        onPress={() => router.push(`/quran/surah/${item.number}` as never)}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-[#F6FBFA]">
      <QuranLibraryHeader
        search={search}
        onChangeSearch={setSearch}
        onBack={() => router.back()}
      />
      <QuranOverviewCards meccanCount={86} medinanCount={28} />

      <FlatList<QuranListItem>
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
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default QuranIndex;
