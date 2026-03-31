import { HomeMenu } from "@/constants/data";
import Icon from "@/constants/Icon";
import {
  SafeAreaView,
  buildPrayerOverview,
  formatPrayerTime,
  getCurrentLocationSnapshot,
  loadAppSettings,
  syncPrayerNotificationsAsync,
  type PrayerOverview,
} from "@/utils/index";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function Index() {
  const { width } = useWindowDimensions();
  const [overview, setOverview] = useState<PrayerOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [quietModeEnabled, setQuietModeEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const menuPages = useMemo(() => {
    const pageSize = 9;
    return Array.from(
      { length: Math.ceil(HomeMenu.length / pageSize) },
      (_, index) =>
        HomeMenu.slice(index * pageSize, index * pageSize + pageSize),
    );
  }, []);

  const loadHomePrayerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const savedSettings = await loadAppSettings();
      setQuietModeEnabled(savedSettings.autoSilentAtPrayer);

      const currentLocation = await getCurrentLocationSnapshot();
      setOverview(buildPrayerOverview(currentLocation));

      if (savedSettings.prayerAlerts) {
        try {
          await syncPrayerNotificationsAsync(currentLocation, savedSettings);
        } catch (notificationError) {
          setError(
            notificationError instanceof Error
              ? notificationError.message
              : "Prayer info loaded, but notifications could not be synced.",
          );
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load prayer information right now.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHomePrayerData();
    }, [loadHomePrayerData]),
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F6FBFA]">
      <View className="flex-1 flex-col">
        <View className="bg-[#14B8A6] pt-4">
          <LinearGradient
            colors={["#14B8A6", "#0F9E8F"]}
            className="rounded-b-4xl px-5"
          >
            <View className="flex-row justify-between px-1">
              <Text className="text-lg text-white opacity-80">
                {overview?.hijriDate ?? "Loading Hijri date..."}
              </Text>
              <Text className="text-lg text-white opacity-80">
                <Ionicons name="location-sharp" size={18} color="white" />{" "}
                {overview?.locationLabel ?? "Current location"}
              </Text>
            </View>

            <View className="items-center justify-center py-8">
              {loading ? (
                <>
                  <ActivityIndicator size="large" color="white" />
                  <Text className="mt-3 text-white opacity-80">
                    Loading prayer info...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="mt-3 text-3xl font-bold text-white">
                    {overview?.currentPrayer.label ?? "Prayer"}
                  </Text>
                  <Text className="text-white opacity-80">Current Prayer</Text>
                  <Text className="mt-2 text-sm text-white/80">
                    Next: {overview?.nextPrayer.label ?? "--"} at{" "}
                    {formatPrayerTime(overview?.nextPrayer.time)}
                  </Text>
                </>
              )}
            </View>

            <View className="mb-28 flex-row justify-around items-center">
              <View className="items-center rounded-4xl bg-white/10 px-6 py-6">
                <Text className="text-xs font-bold text-white">START</Text>
                <Text className="text-lg font-bold text-white">
                  {formatPrayerTime(overview?.currentPrayer.start)}
                </Text>
              </View>

              <View className="items-center rounded-4xl bg-white/10 px-6 py-6">
                <Text className="text-xs font-bold text-white">END</Text>
                <Text className="text-lg font-bold text-white">
                  {formatPrayerTime(overview?.currentPrayer.end)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="-mt-16 px-5">
          <View className="rounded-3xl bg-white p-5 shadow-lg">
            <View className="mb-5 rounded-2xl bg-slate-50 px-4 py-3">
              <Text className="text-sm font-semibold text-slate-800">
                {quietModeEnabled
                  ? "Prayer quiet mode is enabled from Settings"
                  : "Prayer quiet mode is off"}
              </Text>
              <Text className="mt-1 text-xs text-slate-500">
                {error ??
                  "Prayer times are calculated using your live location and the Adhan package."}
              </Text>
            </View>

            <FlatList
              data={menuPages}
              keyExtractor={(_, index) => `page-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              contentContainerStyle={{ paddingTop: 4 }}
              renderItem={({ item: pageItems }) => (
                <View
                  style={{ width: width - 80 }}
                  className="flex-row flex-wrap justify-between"
                >
                  {pageItems.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      activeOpacity={0.8}
                      className="mb-6 w-[31%] items-center"
                    >
                      <View className="rounded-2xl bg-[#E6F7F5] p-4">
                        <Icon
                          type={item.type}
                          name={item.icon}
                          size={28}
                          color="#14B8A6"
                        />
                      </View>

                      <Text className="mt-2 text-center text-xs text-gray-700">
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
