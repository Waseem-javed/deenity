import type { IParaListItem } from "@/types/quran";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ParaListCardProps = {
  para: IParaListItem;
  onPress: () => void;
};

const ParaListCard = ({ para, onPress }: ParaListCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="mb-2 rounded-[28px] border border-[#166534]/30 bg-white px-4 py-4 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-[#DCFCE7]">
            <Text className="text-lg font-bold text-[#4338CA]">
              {para.number}
            </Text>
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-[0.8px] text-slate-400">
              Para {para.number}
            </Text>
            <Text className="mt-1 text-lg font-sans-bold text-[#166534]">
              {para.englishName}({para.arabicName})
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Open this para to read all ayahs
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );
};

export default ParaListCard;
