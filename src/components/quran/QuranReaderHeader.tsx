import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type QuranReaderHeaderProps = {
  badge: string;
  title: string;
  subtitle: string;
  onBack: () => void;
};

const QuranReaderHeader = ({
  badge,
  title,
  subtitle,
  onBack,
}: QuranReaderHeaderProps) => {
  return (
    <View className="rounded-[30px] bg-[#14B8A6] px-5 pb-6 pt-5">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onBack}
          className="h-11 w-11 items-center justify-center rounded-full bg-white/15"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>

        <View className="rounded-full bg-white/15 px-4 py-2">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-white">
            {badge}
          </Text>
        </View>
      </View>

      <Text className="mt-5 text-3xl font-bold text-white">{title}</Text>
      <Text className="mt-2 text-sm leading-6 text-white/85">{subtitle}</Text>
    </View>
  );
};

export default QuranReaderHeader;
