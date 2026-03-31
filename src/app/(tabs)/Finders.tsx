import {
  SafeAreaView,
  calculateQiblaBearing,
  formatLocationLabel,
  getCurrentLocationSnapshot,
  getQiblaOffset,
  watchDeviceHeading,
  type LocationSnapshot,
} from "@/utils/index";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const QiblaFinder = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heading, setHeading] = useState(0);
  const [qiblaBearing, setQiblaBearing] = useState(0);
  const [location, setLocation] = useState<LocationSnapshot | null>(null);

  const headingSubscriptionRef = useRef<{ remove: () => void } | null>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const qiblaOffset = useMemo(
    () => getQiblaOffset(heading, qiblaBearing),
    [heading, qiblaBearing],
  );

  const loadQiblaData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      headingSubscriptionRef.current?.remove();

      const currentLocation = await getCurrentLocationSnapshot();
      setLocation(currentLocation);
      setQiblaBearing(calculateQiblaBearing(currentLocation));

      headingSubscriptionRef.current = await watchDeviceHeading((value) => {
        setHeading(value);
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your location right now.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQiblaData();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseLoop.start();

    return () => {
      headingSubscriptionRef.current?.remove();
      pulseLoop.stop();
    };
  }, [loadQiblaData, pulseAnim]);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: qiblaOffset,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [qiblaOffset, rotateAnim]);

  const needleRotation = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView className="flex-1 p-5">
      <View className="rounded-lg p-4 py-6 bg-[#14B8A6]">
        <Text className="text-3xl font-bold text-white">Qibla Finder</Text>
        <Text className="mt-2 text-sm leading-5 text-white/85">
          Find the Kaaba direction anywhere using your live location and phone
          heading.
        </Text>
      </View>

      <View className="px-5 -mt-4">
        <View className="rounded-[28px] bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-[#14B8A6]">
                Current location
              </Text>
              <Text className="mt-1 text-base font-bold text-slate-800">
                {formatLocationLabel(location)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={loadQiblaData}
              className="rounded-full bg-[#E6F7F5] px-4 py-2"
            >
              <Text className="text-xs font-semibold text-[#0F766E]">
                Refresh
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 flex-row justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <View>
              <Text className="text-[11px] uppercase text-slate-400">
                Qibla bearing
              </Text>
              <Text className="mt-1 text-base font-bold text-slate-800">
                {Math.round(qiblaBearing)}°
              </Text>
            </View>
            <View>
              <Text className="text-[11px] uppercase text-slate-400">
                Device heading
              </Text>
              <Text className="mt-1 text-base font-bold text-slate-800">
                {Math.round(heading)}°
              </Text>
            </View>
            <View>
              <Text className="text-[11px] uppercase text-slate-400">
                Turn by
              </Text>
              <Text className="mt-1 text-base font-bold text-slate-800">
                {Math.round(qiblaOffset)}°
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4 items-center">
          {loading ? (
            <View className="items-center rounded-[28px] bg-white px-8 py-12">
              <ActivityIndicator size="large" color="#14B8A6" />
              <Text className="mt-4 text-sm text-slate-500">
                Loading your location and compass...
              </Text>
            </View>
          ) : (
            <>
              <Animated.View
                style={{ transform: [{ scale: pulseAnim }] }}
                className="h-72 w-72 items-center justify-center rounded-full border-10 border-[#CCFBF1] bg-[#ECFEFF]"
              >
                <Text className="absolute top-4 text-base font-bold text-slate-700">
                  N
                </Text>
                <Text className="absolute bottom-4 text-base font-bold text-slate-700">
                  S
                </Text>
                <Text className="absolute left-4 text-base font-bold text-slate-700">
                  W
                </Text>
                <Text className="absolute right-4 text-base font-bold text-slate-700">
                  E
                </Text>

                <Animated.View
                  style={{ transform: [{ rotate: needleRotation }] }}
                  className="absolute items-center"
                >
                  <Ionicons name="navigate" size={92} color="#14B8A6" />
                </Animated.View>

                <View className="h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#14B8A6]">
                  <Ionicons name="compass" size={34} color="white" />
                </View>
              </Animated.View>
            </>
          )}
        </View>

        {error ? (
          <View className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <Text className="text-sm font-semibold text-amber-700">
              Location required
            </Text>
            <Text className="mt-1 text-xs leading-5 text-amber-600">
              {error}
            </Text>
          </View>
        ) : null}

        <View className="mt-6 gap-3">
          <View className="rounded-2xl bg-white p-4">
            <Text className="text-sm font-semibold text-slate-800">
              How to use
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              1. Allow location access.{"\n"}
              2. Hold your phone flat.{"\n"}
              3. Rotate until the compass arrow aligns with the top marker.
            </Text>
          </View>

          <View className="rounded-2xl bg-white p-4">
            <Text className="text-sm font-semibold text-slate-800">
              Coordinates
            </Text>
            <Text className="mt-2 text-sm text-slate-500">
              Latitude: {location?.latitude?.toFixed(5) ?? "--"}
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Longitude: {location?.longitude?.toFixed(5) ?? "--"}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QiblaFinder;
