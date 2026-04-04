import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type QuranSegmentTabsProps = {
  activeTab: "surah" | "para";
  onChange: (tab: "surah" | "para") => void;
};

const QuranSegmentTabs = ({
  activeTab,
  onChange,
}: QuranSegmentTabsProps) => {
  return (
    <View className="mb-4 flex-row rounded-[22px] bg-slate-200 p-1">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange("surah")}
        className={`flex-1 rounded-[18px] px-4 py-3 ${
          activeTab === "surah" ? "bg-[#0F766E]" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-center text-sm font-semibold ${
            activeTab === "surah" ? "text-white" : "text-slate-600"
          }`}
        >
          Surah
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange("para")}
        className={`flex-1 rounded-[18px] px-4 py-3 ${
          activeTab === "para" ? "bg-[#0F766E]" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-center text-sm font-semibold ${
            activeTab === "para" ? "text-white" : "text-slate-600"
          }`}
        >
          Para
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuranSegmentTabs;
