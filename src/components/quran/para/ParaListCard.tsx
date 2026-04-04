import { ISurah } from "@/types/quran";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ParaListCardProps = {
  para: ISurah;
  onPress: () => void;
};

const ParaListCard = ({ para, onPress }: ParaListCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="mb-3 rounded-[28px] border border-white bg-white px-4 py-4 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-[#EEF2FF]">
            <Text className="text-lg font-bold text-[#4338CA]">1</Text>
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-[0.8px] text-slate-400">
              Para 1
            </Text>
            <Text className="mt-1 text-lg font-bold text-slate-900">Juz 1</Text>
            <Text className="mt-1 text-sm text-slate-500">range</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </View>

      <View className="mt-4 rounded-[22px] bg-slate-50 px-4 py-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-[0.8px] text-slate-400">
              Arabic Opening
            </Text>
            <Text className="mt-1 text-right text-xl text-[#0F172A]">name</Text>
          </View>
          <View className="ml-3 rounded-full bg-[#4338CA] px-3 py-1.5">
            <Text className="text-[11px] font-semibold uppercase tracking-[0.8px] text-white">
              Para 1
            </Text>
          </View>
        </View>

        <Text className="mt-3 text-sm font-medium text-slate-700">
          eng name
        </Text>
        <Text className="mt-1 text-sm leading-6 text-slate-500">range</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ParaListCard;
