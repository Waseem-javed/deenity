import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";

import { AsyncState } from "@/components/ui/AsyncState";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { useQiblaHeading } from "@/hooks/useQiblaHeading";
import { useTabBarClearance } from "@/hooks/useTabBarClearance";

const DIAL_RADIUS = 78;
const LABEL_SIZE = 24;

const CARDINALS = [
  { label: "N", angle: 0 },
  { label: "E", angle: 90 },
  { label: "S", angle: 180 },
  { label: "W", angle: 270 },
];

/** Picks the equivalent target angle closest to `current`, so the needle animates the short way around. */
function shortestRotation(current: number, targetMod360: number) {
  const currentMod = ((current % 360) + 360) % 360;
  let delta = targetMod360 - currentMod;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return current + delta;
}

function CardinalLabel({ label, angle, dialRotation }: { label: string; angle: number; dialRotation: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const placementAngle = angle + dialRotation.value;
    return {
      transform: [
        { translateX: -LABEL_SIZE / 2 },
        { translateY: -LABEL_SIZE / 2 },
        { rotate: `${placementAngle}deg` },
        { translateY: -DIAL_RADIUS },
        { rotate: `${-placementAngle}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        { position: "absolute", top: "50%", left: "50%", width: LABEL_SIZE, height: LABEL_SIZE, alignItems: "center", justifyContent: "center" },
        style,
      ]}
    >
      <Text className="text-sm font-semibold text-slate-400 dark:text-slate-500">{label}</Text>
    </Animated.View>
  );
}

export default function QiblaScreen() {
  const clearance = useTabBarClearance();
  const { heading, qiblaBearing, aligned, loading: locating, error: locationError, retry: retryLocation } = useQiblaHeading();

  const rotation = useSharedValue(0);
  const dialRotation = useSharedValue(0);

  useEffect(() => {
    if (heading === null) return;
    const dialTarget = ((-heading % 360) + 360) % 360;
    dialRotation.value = withTiming(shortestRotation(dialRotation.value, dialTarget), { duration: 200 });

    if (qiblaBearing === null) return;
    const target = ((qiblaBearing - heading) % 360 + 360) % 360;
    rotation.value = withTiming(shortestRotation(rotation.value, target), { duration: 200 });
  }, [qiblaBearing, heading, rotation, dialRotation]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <ScreenContainer className="items-center justify-center" edges={["top", "left", "right"]} style={{ paddingBottom: clearance }}>
      <Text className="text-3xl font-semibold text-slate-900 dark:text-white">Qibla Direction</Text>
      <Text className="mt-1 text-center text-base text-slate-600 dark:text-slate-300">
        Hold your phone flat and turn until the arrow points up
      </Text>

      <AsyncState loading={locating} error={locationError} onRetry={retryLocation}>
        <View className="mt-10 items-center justify-center">
          <View
            className={[
              "h-48 w-48 items-center justify-center rounded-full bg-white/70 dark:bg-white/10 border-2",
              aligned ? "border-emerald-500" : "border-white/60 dark:border-white/10",
            ].join(" ")}
            style={
              aligned
                ? { shadowColor: "#10b981", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 4 }
                : { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 2 }
            }
          >
            {CARDINALS.map((cardinal) => (
              <CardinalLabel key={cardinal.label} label={cardinal.label} angle={cardinal.angle} dialRotation={dialRotation} />
            ))}

            <Animated.View style={animatedStyle}>
              <MaterialCommunityIcons name="navigation" size={64} color={aligned ? "#10b981" : "#0f8478"} />
            </Animated.View>
          </View>
          <Text className="mt-6 text-2xl font-semibold text-slate-900 dark:text-white">
            {qiblaBearing !== null ? `${Math.round(qiblaBearing)}°` : "—"}
          </Text>
          <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">from true north</Text>
          {aligned ? <Text className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">Facing the Qibla</Text> : null}
        </View>
      </AsyncState>
    </ScreenContainer>
  );
}
