import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type FeatureCardProps = {
  href: Href;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tone?: "brand" | "amber" | "emerald" | "rose";
  /** Position within its grid/list, used to stagger the entrance animation. */
  index?: number;
};

const TONES = {
  brand: { bg: "bg-brand-50 dark:bg-brand-400/15", fg: "#0f8478" },
  amber: { bg: "bg-amber-50 dark:bg-amber-400/15", fg: "#b45309" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-400/15", fg: "#047857" },
  rose: { bg: "bg-rose-50 dark:bg-rose-400/15", fg: "#be123c" },
} as const;

export function FeatureCard({ href, title, subtitle, icon, tone = "brand", index = 0 }: FeatureCardProps) {
  const { bg, fg } = TONES[tone];
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Link href={href} asChild>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 16, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 16, stiffness: 300 });
        }}
        className="w-[48%]"
      >
        <Animated.View entering={FadeInDown.delay(index * 50).springify().damping(16)} style={animatedStyle}>
          <View
            className="rounded-3xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 }}
          >
            <View className={["h-12 w-12 items-center justify-center rounded-2xl", bg].join(" ")}>
              <MaterialCommunityIcons name={icon} size={22} color={fg} />
            </View>
            <Text className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{title}</Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400" numberOfLines={2}>
              {subtitle}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
}
