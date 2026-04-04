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

const DEFAULT_ARABIC_FONT_SIZE = 30;
const DEFAULT_LINE_COUNT = 16;

const formatAyahMarker = (ayahNumber: number) => ` ۝ ${ayahNumber}`;

const QuranPageCard = ({
  pageNumber,
  juzNumbers,
  juzLabel,
  ayahs = [],
  arabicText,
  arabicFontSize = DEFAULT_ARABIC_FONT_SIZE,
  minHeight,
  translations,
}: QuranPageCardProps) => {
  const arabicLineHeight = Math.round(arabicFontSize * 1.9);
  const pageMinHeight = minHeight ?? arabicLineHeight * DEFAULT_LINE_COUNT;

  const resolvedJuzLabel = useMemo(() => {
    if (juzLabel) {
      return juzLabel;
    }

    if (juzNumbers?.length) {
      return `Juz ${juzNumbers.join(", ")}`;
    }

    return "Quran Page";
  }, [juzLabel, juzNumbers]);

  const ayahRangeLabel = useMemo(() => {
    if (!ayahs.length) {
      return null;
    }

    const firstAyah = ayahs[0]?.numberInSurah;
    const lastAyah = ayahs[ayahs.length - 1]?.numberInSurah;

    if (!firstAyah || !lastAyah) {
      return null;
    }

    return `Ayah ${firstAyah}-${lastAyah}`;
  }, [ayahs]);

  const resolvedArabicText = useMemo(() => {
    if (arabicText?.trim()) {
      return arabicText.trim();
    }

    if (!ayahs.length) {
      return "";
    }

    return ayahs
      .map((ayah) => `${ayah.text.trim()}${formatAyahMarker(ayah.numberInSurah)}`)
      .join("  ");
  }, [arabicText, ayahs]);

  return (
    <View className="mb-5 overflow-hidden rounded-[30px] border border-[#DDEEEA] bg-[#FFFDF7] shadow-sm">
      <View className="border-b border-[#E7F1EE] bg-[#F4FBF8] px-5 py-4">
        <View className="flex-row items-center justify-between">
          <View className="rounded-full bg-[#DDF4EC] px-3 py-2">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-[#0F766E]">
              Page {pageNumber}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-xs font-semibold uppercase tracking-[0.8px] text-slate-500">
              {resolvedJuzLabel}
            </Text>
            {ayahRangeLabel ? (
              <Text className="mt-1 text-xs text-slate-400">{ayahRangeLabel}</Text>
            ) : null}
          </View>
        </View>
      </View>

      <View className="px-5 py-5">
        <View
          className="rounded-[26px] border border-[#EFE7D4] bg-[#FFFCF2] px-5 py-6"
          style={{ minHeight: pageMinHeight }}
        >
          <View className="absolute inset-x-4 top-4 h-px bg-[#E9DFC8]" />
          <View className="absolute inset-x-4 bottom-4 h-px bg-[#E9DFC8]" />

          <Text
            className="text-right text-slate-900"
            style={{
              fontSize: arabicFontSize,
              lineHeight: arabicLineHeight,
              writingDirection: "rtl",
              minHeight: pageMinHeight - 24,
            }}
          >
            {resolvedArabicText}
          </Text>
        </View>

        {translations?.length ? (
          <View className="mt-4 rounded-[22px] bg-white px-4 py-4">
            {translations.map((translation) => (
              <View
                key={`${translation.ayahNumber}-${translation.surahName ?? "surah"}`}
                className="mb-3 last:mb-0"
              >
                <Text className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#0F766E]">
                  Ayah {translation.ayahNumber}
                </Text>
                <Text className="mt-1 text-sm leading-6 text-slate-600">
                  {translation.translationText ?? translation.text ?? ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default QuranPageCard;
