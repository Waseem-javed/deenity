import React from "react";
import { Text, View } from "react-native";

type QuranOverviewCardsProps = {
  meccanCount: number;
  medinanCount: number;
};

const QuranOverviewCards = ({
  meccanCount,
  medinanCount,
}: QuranOverviewCardsProps) => {
  return (
    <View className="-mt-4 rounded-[28px] bg-white p-5 shadow-sm">
      <Text className="text-xs font-semibold uppercase tracking-[1px] text-[#0F766E]">
        Quran Overview
      </Text>
      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 items-center justify-center rounded-2xl bg-[#ECFDF5] px-4 py-4">
          <Text className="text-[11px] uppercase text-emerald-700">Surahs</Text>
          <Text className="mt-1 text-2xl font-bold text-slate-900">114</Text>
        </View>
        <View className="flex-1 items-center justify-center rounded-2xl bg-[#F5F3FF] px-4 py-4">
          <Text className="text-[11px] uppercase text-violet-700">Paras</Text>
          <Text className="mt-1 text-2xl font-bold text-slate-900">30</Text>
        </View>
        <View className="flex-1 items-center justify-center rounded-2xl bg-[#EFF6FF] px-4 py-4">
          <Text className="text-[11px] uppercase text-blue-700">Makkah</Text>
          <Text className="mt-1 text-2xl font-bold text-slate-900">
            {meccanCount}
          </Text>
        </View>
        <View className="flex-1 items-center justify-center rounded-2xl bg-[#FFF7ED] px-4 py-4">
          <Text className="text-[11px] uppercase text-orange-700">Madinah</Text>
          <Text className="mt-1 text-2xl font-bold text-slate-900">
            {medinanCount}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default QuranOverviewCards;
