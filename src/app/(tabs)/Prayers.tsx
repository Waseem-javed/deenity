import {
  SafeAreaView,
  buildPrayerOverview,
  defaultAppSettings,
  formatPrayerTime,
  getCurrentLocationSnapshot,
  loadAppSettings,
  syncPrayerNotificationsAsync,
  type AppSettings,
  type PrayerOverview,
} from "@/utils/index";
import { useFocusEffect } from "@react-navigation/native";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PrayerRowProps = {
  label: string;
  time: string;
  isCurrent?: boolean;
  isNext?: boolean;
};

const PrayerRow = ({
  label,
  time,
  isCurrent = false,
  isNext = false,
}: PrayerRowProps) => (
  <View
    className={clsx(
      "flex-row items-center justify-between rounded-2xl border px-4 py-4",
      isCurrent ? "border-[#14B8A6] bg-[#E6F7F5]" : "border-slate-100 bg-white",
    )}
  >
    <View>
      <Text className="text-base font-semibold text-slate-800">{label}</Text>
      <Text className="mt-1 text-xs text-slate-500">
        {isCurrent ? "Current prayer window" : isNext ? "Coming next" : "Today"}
      </Text>
    </View>

    <Text className="text-base font-bold text-slate-800">{time}</Text>
  </View>
);

const Prayers = () => {
  const [overview, setOverview] = useState<PrayerOverview | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrayerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const savedSettings = await loadAppSettings();
      setSettings(savedSettings);

      const currentLocation = await getCurrentLocationSnapshot();
      setOverview(buildPrayerOverview(currentLocation));

      if (savedSettings.prayerAlerts) {
        try {
          await syncPrayerNotificationsAsync(currentLocation, savedSettings);
        } catch (notificationError) {
          setError(
            notificationError instanceof Error
              ? notificationError.message
              : "Prayer times loaded, but notifications could not be scheduled.",
          );
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load prayer times right now.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPrayerData();
    }, [loadPrayerData]),
  );

  const quietModeText = settings.autoSilentAtPrayer
    ? overview?.currentPrayer.key === "sunrise"
      ? "Quiet mode is enabled and will apply during the next salah window."
      : "Quiet mode is enabled for prayer time."
    : "Quiet mode is off. You can enable it from Settings.";

  return (
    <SafeAreaView className="flex-1 p-5 bg-[#F6FBFA]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="bg-[#14B8A6] rounded-lg px-5 pb-8 pt-4">
          <Text className="text-3xl font-bold text-white">Prayer Times</Text>
          <Text className="mt-2 text-sm text-white/85">
            {overview?.gregorianDate ??
              "Use your current location for accurate salah timings."}
          </Text>
        </View>

        <View className="-mt-4 px-5">
          <View className="rounded-[28px] bg-white p-5 shadow-sm">
            {loading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#14B8A6" />
                <Text className="mt-3 text-sm text-slate-500">
                  Calculating today’s prayer times...
                </Text>
              </View>
            ) : overview ? (
              <>
                <Text className="text-xs font-semibold uppercase tracking-[1px] text-[#14B8A6]">
                  Current prayer
                </Text>
                <Text className="mt-1 text-3xl font-bold text-slate-900">
                  {overview.currentPrayer.label}
                </Text>
                <Text className="mt-1 text-sm text-slate-500">
                  {formatPrayerTime(overview.currentPrayer.start)} -{" "}
                  {formatPrayerTime(overview.currentPrayer.end)}
                </Text>

                <View className="mt-4 flex-row justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <View>
                    <Text className="text-[11px] uppercase text-slate-400">
                      Next prayer
                    </Text>
                    <Text className="mt-1 text-base font-bold text-slate-800">
                      {overview.nextPrayer.label}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-[11px] uppercase text-slate-400">
                      Starts at
                    </Text>
                    <Text className="mt-1 text-base font-bold text-slate-800">
                      {formatPrayerTime(overview.nextPrayer.time)}
                    </Text>
                  </View>
                </View>

                <View className="mt-4 rounded-2xl bg-slate-900 px-4 py-3">
                  <Text className="text-sm font-semibold text-white">
                    Prayer quiet mode
                  </Text>
                  <Text className="mt-1 text-xs leading-5 text-slate-300">
                    {quietModeText} Device-wide silent mode depends on platform
                    support, but this setting is now shared from `Settings`.
                  </Text>
                </View>
              </>
            ) : (
              <View className="py-6">
                <Text className="text-base font-semibold text-slate-800">
                  Prayer times unavailable
                </Text>
                <Text className="mt-2 text-sm text-slate-500">{error}</Text>
                <TouchableOpacity
                  onPress={loadPrayerData}
                  className="mt-4 self-start rounded-full bg-[#14B8A6] px-4 py-2"
                >
                  <Text className="text-xs font-semibold text-white">
                    Try again
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {overview ? (
            <View className="mt-6 gap-3">
              <Text className="text-base font-bold text-slate-800">
                Today’s schedule • {overview.locationLabel}
              </Text>
              {overview.prayers.map((prayer) => (
                <PrayerRow
                  key={prayer.key}
                  label={prayer.label}
                  time={formatPrayerTime(prayer.time)}
                  isCurrent={prayer.isCurrent}
                  isNext={prayer.isNext}
                />
              ))}
            </View>
          ) : null}

          {error && overview ? (
            <View className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <Text className="text-sm font-semibold text-amber-700">
                Location note
              </Text>
              <Text className="mt-1 text-xs leading-5 text-amber-600">
                {error}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Prayers;
