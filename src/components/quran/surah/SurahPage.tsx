import type { IAyah } from "@/types/quran";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

type QuranPageCardProps = {
  pageNumber: number;
  juzNumbers?: number[];
  juzLabel?: string;
  ayahs?: IAyah[];
  arabicText?: string;
  arabicFontSize?: number;
  minHeight?: number;
};

const formatAyahMarker = (ayahNumber: number) =>
  `\u06DD${ayahNumber.toLocaleString("ar-EG", { useGrouping: false })}`;

const QuranPageCard = ({
  pageNumber,
  juzNumbers,
  juzLabel,
  ayahs = [],
  arabicText,
  arabicFontSize = 30,
  minHeight,
}: QuranPageCardProps) => {
  const resolvedArabicText = useMemo(() => {
    if (arabicText?.trim()) {
      return arabicText.trim();
    }

    if (!ayahs.length) {
      return "";
    }

    return ayahs
      .map(
        (ayah) => `${ayah.text.trim()}${formatAyahMarker(ayah.numberInSurah)}`,
      )
      .join("  ");
  }, [arabicText, ayahs]);

  return (
    <View className="my-2 rounded-[28px] border border-[#E7F1EE] bg-white/10 p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[1px] text-white">
          {juzLabel ?? (juzNumbers?.length ? `Juz ${juzNumbers.join(", ")}` : "Quran")}
        </Text>
        <Text className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[1px] text-white">
          Page {pageNumber}
        </Text>
      </View>

      <View style={minHeight ? { minHeight } : undefined}>
        <Text
          className="py-2 text-right font-bold leading-tight text-white"
          style={{ fontSize: arabicFontSize }}
        >
          {resolvedArabicText}
        </Text>
      </View>
    </View>
  );
};

export default QuranPageCard;
