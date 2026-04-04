import {
    SafeAreaView,
    cancelScheduledPrayerNotificationsAsync,
    defaultAppSettings,
    formatLocationLabel,
    getCurrentLocationSnapshot,
    loadAppSettings,
    openAndroidDndSettingsAsync,
    syncPrayerNotificationsAsync,
    updateAppSettings,
    type AppSettings,
} from "@/utils/index";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

type ArabicFontScale = AppSettings["arabicFontScale"];

type SettingRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  value?: boolean;
  rightText?: string;
  isSwitch?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
};

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="mb-3 mt-5 text-base font-bold text-slate-800">{title}</Text>
);

const SettingRow = ({
  icon,
  title,
  subtitle,
  value = false,
  rightText,
  isSwitch = false,
  onValueChange,
  onPress,
}: SettingRowProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={isSwitch ? undefined : onPress}
      className="flex-row items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4"
    >
      <View className="flex-1 flex-row items-center">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#E6F7F5]">
          <Ionicons name={icon} size={20} color="#14B8A6" />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-[15px] font-semibold text-slate-800">
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-1 text-xs text-slate-500">{subtitle}</Text>
          ) : null}
        </View>
      </View>

      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#D1D5DB", true: "#99F6E4" }}
          thumbColor={value ? "#14B8A6" : "#F8FAFC"}
        />
      ) : (
        <View className="flex-row items-center">
          {rightText ? (
            <Text className="mr-2 text-xs font-medium text-slate-500">
              {rightText}
            </Text>
          ) : null}
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const Settings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [locationLabel, setLocationLabel] = useState("Current location");
  const [notificationStatus, setNotificationStatus] = useState(
    "Prayer alerts will be scheduled for the next 7 days when enabled.",
  );

  const nextArabicFontScale: ArabicFontScale =
    settings.arabicFontScale === "small"
      ? "medium"
      : settings.arabicFontScale === "medium"
        ? "large"
        : "small";

  useEffect(() => {
    const loadInitialData = async () => {
      const savedSettings = await loadAppSettings();
      setSettings(savedSettings);

      try {
        const currentLocation = await getCurrentLocationSnapshot();
        setLocationLabel(formatLocationLabel(currentLocation));
      } catch {
        setLocationLabel("Permission needed");
      }

      setNotificationStatus(
        savedSettings.prayerAlerts
          ? "Prayer alerts are enabled and ready to sync."
          : "Prayer alerts are currently off.",
      );
    };

    void loadInitialData();
  }, []);

  const handleToggle = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    const nextSettings = { ...settings, [key]: value };
    setSettings(nextSettings);
    await updateAppSettings({ [key]: value } as Partial<AppSettings>);

    if (
      key === "prayerAlerts" ||
      key === "autoSilentAtPrayer" ||
      key === "adhanSoundEnabled"
    ) {
      try {
        if (nextSettings.prayerAlerts) {
          const currentLocation = await getCurrentLocationSnapshot();
          setLocationLabel(formatLocationLabel(currentLocation));

          const scheduledCount = await syncPrayerNotificationsAsync(
            currentLocation,
            nextSettings,
          );

          setNotificationStatus(
            `Scheduled ${scheduledCount} prayer alerts for the next 7 days${
              nextSettings.autoSilentAtPrayer
                ? " in quiet mode."
                : nextSettings.adhanSoundEnabled
                  ? " with sound."
                  : " without sound."
            }`,
          );
        } else {
          const removedCount = await cancelScheduledPrayerNotificationsAsync();
          setNotificationStatus(
            `Prayer alerts disabled. Removed ${removedCount} scheduled notifications.`,
          );
        }
      } catch (err) {
        setNotificationStatus(
          err instanceof Error
            ? err.message
            : "Unable to update prayer notification settings right now.",
        );
      }
    }
  };

  const handleArabicFontScale = async () => {
    const nextSettings = { ...settings, arabicFontScale: nextArabicFontScale };
    setSettings(nextSettings);
    await updateAppSettings({ arabicFontScale: nextArabicFontScale });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6FBFA]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <Text className="text-3xl font-bold text-slate-900">Settings</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Manage your account, prayers, notifications, and app preferences.
        </Text>

        <View className="mt-5 rounded-[28px] bg-[#14B8A6] p-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <Text className="text-xl font-bold text-white">MD</Text>
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-lg font-bold text-white">
                  Waseem Javed
                </Text>
                <Text className="text-xs text-white/80">
                  deenity.user@email.com
                </Text>
              </View>
            </View>

            <TouchableOpacity className="rounded-full bg-white/20 px-4 py-2">
              <Text className="text-xs font-semibold text-white">Edit</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 flex-row justify-between rounded-2xl bg-white/10 px-4 py-3">
            <View>
              <Text className="text-xs text-white/70">City</Text>
              <Text className="mt-1 font-semibold text-white">
                {locationLabel}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-white/70">Language</Text>
              <Text className="mt-1 font-semibold text-white">English</Text>
            </View>
          </View>
        </View>

        <SectionTitle title="Prayer & Notifications" />
        <View className="gap-3">
          <SettingRow
            icon="notifications-outline"
            title="Prayer alerts"
            subtitle="Schedule real local notifications for each salah"
            isSwitch
            value={settings.prayerAlerts}
            onValueChange={(value) => void handleToggle("prayerAlerts", value)}
          />
          <SettingRow
            icon="volume-high-outline"
            title="Adhan sound"
            subtitle="Play a sound when the prayer notification arrives"
            isSwitch
            value={settings.adhanSoundEnabled}
            onValueChange={(value) =>
              void handleToggle("adhanSoundEnabled", value)
            }
          />
          <SettingRow
            icon="moon-outline"
            title="Prayer quiet mode"
            subtitle="Keep prayer alerts silent and prepare Android DND access"
            isSwitch
            value={settings.autoSilentAtPrayer}
            onValueChange={(value) =>
              void handleToggle("autoSilentAtPrayer", value)
            }
          />
          <SettingRow
            icon="time-outline"
            title="Daily reminders"
            subtitle="Morning azkar and habit reminders"
            isSwitch
            value={settings.dailyReminders}
            onValueChange={(value) =>
              void handleToggle("dailyReminders", value)
            }
          />
          <SettingRow
            icon="location-outline"
            title="Location"
            subtitle="Used for accurate prayer timings"
            rightText={locationLabel}
          />
        </View>

        <View className="mt-4 rounded-2xl bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">
            Notification status
          </Text>
          <Text className="mt-1 text-xs leading-5 text-slate-300">
            {notificationStatus}
          </Text>

          {settings.autoSilentAtPrayer ? (
            <TouchableOpacity
              onPress={() => void openAndroidDndSettingsAsync()}
              className="mt-3 self-start rounded-full bg-white px-4 py-2"
            >
              <Text className="text-xs font-semibold text-slate-900">
                Open Android DND settings
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <SectionTitle title="App Preferences" />
        <View className="gap-3">
          <SettingRow
            icon="contrast-outline"
            title="Dark mode"
            subtitle="Use a darker appearance at night"
            isSwitch
            value={settings.darkMode}
            onValueChange={(value) => void handleToggle("darkMode", value)}
          />
          <SettingRow
            icon="lock-closed-outline"
            title="Biometric lock"
            subtitle="Protect the app with Face ID / Touch ID"
            isSwitch
            value={settings.biometricLock}
            onValueChange={(value) => void handleToggle("biometricLock", value)}
          />
          <SettingRow
            icon="language-outline"
            title="Language"
            subtitle="Change app language"
            rightText="English"
          />
          <SettingRow
            icon="text-outline"
            title="Arabic font size"
            subtitle="Adjust Quran and dua text size"
            rightText={settings.arabicFontScale}
            onPress={handleArabicFontScale}
          />
        </View>

        <SectionTitle title="Support & About" />
        <View className="gap-3">
          <SettingRow
            icon="help-circle-outline"
            title="Help center"
            subtitle="FAQs, contact, and app guidance"
          />
          <SettingRow
            icon="shield-checkmark-outline"
            title="Privacy policy"
            subtitle="Read how your data is handled"
          />
          <SettingRow
            icon="document-text-outline"
            title="Terms & conditions"
            subtitle="Review the app terms of use"
          />
          <SettingRow
            icon="star-outline"
            title="Rate Deenity"
            subtitle="Share feedback on the app store"
          />
        </View>

        <View className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 p-4">
          <Text className="text-sm font-semibold text-rose-600">Account</Text>
          <Text className="mt-1 text-xs text-rose-500">
            Signing out will remove this device from your active session.
          </Text>
          <TouchableOpacity className="mt-4 items-center rounded-xl bg-rose-500 py-3">
            <Text className="font-semibold text-white">Sign out</Text>
          </TouchableOpacity>
        </View>

        <Text className="mt-5 text-center text-xs text-slate-400">
          Deenity v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
