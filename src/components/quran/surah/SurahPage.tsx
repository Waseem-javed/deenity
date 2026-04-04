import type { IAyah } from "@/types/quran";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

type TranslationLine = {
  ayahNumber: number;
  surahName?: string;
  text?: string;
  translationText?: string;
};

type QuranPageCardProps = {
  pageNumber: number;
  juzNumbers?: number[];
  juzLabel?: string;
  ayahs?: IAyah[];
  arabicText?: string;
  arabicFontSize?: number;
  minHeight?: number;
  translations?: TranslationLine[];
};

const formatAyahMarker = (ayahNumber: number) =>
  `\u06DD${ayahNumber.toLocaleString("ar-EG", { useGrouping: false })}`;

const QuranPageCard = ({
  pageNumber,
  juzNumbers,
  juzLabel,
  ayahs = [],
  arabicText,
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
    <View className="rounded-lg border border-[#E7F1EE] p-2 my-2">
      <View className="">
        <Text className="leading-tight text-white text-justify py-2 font-space text-3xl font-bold">
          {resolvedArabicText}
        </Text>
      </View>

      <View className="flex justify-center items-center">
        <Text className="bg-white/10 px-4 p-2 rounded-full text-xs font-semibold uppercase tracking-[1px] text-white">
          {pageNumber}
        </Text>
      </View>
    </View>
  );
};

export default QuranPageCard;
