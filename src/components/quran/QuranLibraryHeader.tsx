import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type QuranLibraryHeaderProps = {
  search: string;
  onChangeSearch: (value: string) => void;
  onBack: () => void;
};

const QuranLibraryHeader = ({
  search,
  onChangeSearch,
  onBack,
}: QuranLibraryHeaderProps) => {
  return (
    <View className="rounded-[30px] bg-[#0F766E] px-5 pb-6 pt-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            onPress={onBack}
            className="h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Al Qur&apos;an</Text>
        </View>

        <View className="rounded-full bg-emerald-300/20 px-4 py-2">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-white">
            Quran Reader
          </Text>
        </View>
      </View>

      {/* <Text className="mt-2 text-sm leading-6 text-white/85">
        Browse the complete Quran by surah or para, then open a dedicated
        reading page for each section.
      </Text> */}

      <View className="mt-5 rounded-[26px] bg-white/10 p-4">
        <Text className="text-[11px] uppercase tracking-[1px] text-white/70">
          Search Quran
        </Text>
        <View className="mt-3 flex-row items-center rounded-2xl bg-white px-4 py-1">
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            value={search}
            onChangeText={onChangeSearch}
            placeholder="Find by surah, para, juz, or name"
            placeholderTextColor="#94A3B8"
            className="ml-3 flex-1 py-3 text-[15px] text-slate-800"
          />
        </View>
      </View>
    </View>
  );
};

export default QuranLibraryHeader;
