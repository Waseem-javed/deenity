import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useColorScheme } from "nativewind";
import { Dimensions, FlatList, Text, View, type ListRenderItemInfo, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { Button } from "react-native-paper";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { setHasOnboarded } from "@/lib/onboarding";

const { width } = Dimensions.get("window");

type Slide = {
  key: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
};

const SLIDES: Slide[] = [
  {
    key: "welcome",
    icon: "mosque",
    title: "Assalamu Alaikum",
    description: "Deenity brings the Quran, prayer times, and daily worship tools together in one calm, focused place.",
  },
  {
    key: "quran",
    icon: "book-open-page-variant",
    title: "Read the Quran",
    description: "A clean 16-line Indopak Mushaf, duas, and the 99 Names of Allah — all in one reader.",
  },
  {
    key: "daily",
    icon: "compass-outline",
    title: "Stay on time",
    description: "Accurate prayer times, Qibla direction, and a Zakat calculator, wherever you are.",
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);
  const isLast = index === SLIDES.length - 1;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  async function finish() {
    await setHasOnboarded(true);
    router.replace("/(tabs)");
  }

  function next() {
    if (isLast) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  }

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (nextIndex !== index) setIndex(nextIndex);
  }

  function renderSlide({ item }: ListRenderItemInfo<Slide>) {
    return (
      <Animated.View entering={FadeIn.duration(500)} style={{ width }} className="flex-1 items-center justify-center px-8">
        <LinearGradient
          colors={["#1ba894", "#005A5A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 112,
            width: 112,
            borderRadius: 56,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#005A5A",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <MaterialCommunityIcons name={item.icon} size={48} color="#ffffff" />
        </LinearGradient>
        <Text className="mt-8 text-center text-2xl font-semibold text-slate-900 dark:text-white">{item.title}</Text>
        <Text className="mt-3 text-center text-base leading-6 text-slate-600 dark:text-slate-300">{item.description}</Text>
      </Animated.View>
    );
  }

  return (
    <ScreenContainer className="px-0 py-0">
      <View className="flex-row justify-end px-6 pt-2">
        <Button onPress={finish} textColor="#64748b">
          Skip
        </Button>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        className="flex-1"
      />

      <View className="flex-row items-center justify-center gap-2 pb-6">
        {SLIDES.map((slide, i) => (
          <Animated.View
            key={slide.key}
            layout={LinearTransition.duration(200)}
            className="rounded-full"
            style={{
              height: 8,
              width: i === index ? 24 : 8,
              backgroundColor: i === index ? "#0f8478" : isDark ? "#334155" : "#cbd5e1",
            }}
          />
        ))}
      </View>

      <View className="px-6 pb-6">
        <Button mode="contained" onPress={next} icon={isLast ? "check" : "arrow-right"}>
          {isLast ? "Get started" : "Next"}
        </Button>
      </View>
    </ScreenContainer>
  );
}
