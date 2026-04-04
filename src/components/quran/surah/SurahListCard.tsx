import type { ISurah } from "@/types/quran";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type SurahListCardProps = {
  surah: ISurah;
  onPress: () => void;
};

const SurahListCard = ({ surah, onPress }: SurahListCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="mb-3 rounded-[28px] border border-white bg-white px-4 py-4 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-[#DCFCE7]">
            <Text className="text-lg font-bold text-[#166534]">
              {surah.number}
            </Text>
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-[0.8px] text-slate-400">
              Surah {surah.number}
            </Text>
            <Text className="mt-1 text-lg font-bold text-red-800">
              {surah.englishName}({surah.name})
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              {surah.englishNameTranslation}
            </Text>
          </View>
        </View>
        <View className="flex items-center">
          <View className="rounded-full bg-[#0F766E] px-3 py-1.5">
            <Text className="text-[11px] font-semibold uppercase tracking-[0.8px] text-white">
              {surah.revelationType}
            </Text>
          </View>
          <View className="mt-4 rounded-[22px] bg-slate-100 px-3 py-1.5">
            <Text className="text-xs uppercase tracking-[0.8px] text-slate-400">
              {surah.numberOfAyahs} Ayahs
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );
};

export default SurahListCard;
