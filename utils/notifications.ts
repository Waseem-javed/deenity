import * as IntentLauncher from "expo-intent-launcher";
import * as Notifications from "expo-notifications";
import { Linking, Platform } from "react-native";
import type { LocationSnapshot } from "./location";
import {
    buildPrayerOverview,
    formatPrayerTime,
    type PrayerKey,
} from "./prayer";
import type { AppSettings } from "./settings";

const PRAYER_NOTIFICATION_KIND = "prayer-alert";
const PRAYER_NOTIFICATION_CHANNEL_ID = "prayer-alerts";
const NOTIFIABLE_PRAYERS: PrayerKey[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

export const configureNotificationHandling = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

export const requestNotificationPermissionsAsync = async () => {
  const existingPermission = await Notifications.getPermissionsAsync();

  if (existingPermission.granted) {
    return existingPermission;
  }

  const requestedPermission = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  if (!requestedPermission.granted) {
    throw new Error(
      "Notification access is needed for prayer alerts and adhan reminders.",
    );
  }

  return requestedPermission;
};

export const cancelScheduledPrayerNotificationsAsync = async () => {
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  const prayerNotificationIds = scheduledNotifications
    .filter(
      (notification) =>
        notification.content.data?.kind === PRAYER_NOTIFICATION_KIND,
    )
    .map((notification) => notification.identifier);

  await Promise.all(
    prayerNotificationIds.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id),
    ),
  );

  return prayerNotificationIds.length;
};

const ensurePrayerNotificationChannelAsync = async (settings: AppSettings) => {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    PRAYER_NOTIFICATION_CHANNEL_ID,
    {
      name: settings.autoSilentAtPrayer
        ? "Prayer Quiet Alerts"
        : "Prayer Alerts",
      importance: settings.autoSilentAtPrayer
        ? Notifications.AndroidImportance.DEFAULT
        : Notifications.AndroidImportance.MAX,
      vibrationPattern: settings.autoSilentAtPrayer ? [0] : [0, 250, 250, 250],
      enableVibrate: !settings.autoSilentAtPrayer,
      sound:
        settings.autoSilentAtPrayer || !settings.adhanSoundEnabled
          ? undefined
          : "default",
      lightColor: "#14B8A6",
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
    },
  );
};

export const syncPrayerNotificationsAsync = async (
  location: LocationSnapshot,
  settings: AppSettings,
  daysAhead = 7,
) => {
  await cancelScheduledPrayerNotificationsAsync();

  if (!settings.prayerAlerts) {
    return 0;
  }

  await requestNotificationPermissionsAsync();
  await ensurePrayerNotificationChannelAsync(settings);

  const now = new Date();
  let scheduledCount = 0;

  for (let dayOffset = 0; dayOffset < daysAhead; dayOffset += 1) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + dayOffset);

    const overview = buildPrayerOverview(location, targetDate);

    for (const prayerKey of NOTIFIABLE_PRAYERS) {
      const prayer = overview.prayers.find((entry) => entry.key === prayerKey);

      if (!prayer || prayer.time <= now) {
        continue;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.label} prayer time`,
          body: `${prayer.label} starts at ${formatPrayerTime(prayer.time)} • ${overview.locationLabel}`,
          sound:
            settings.autoSilentAtPrayer || !settings.adhanSoundEnabled
              ? false
              : "default",
          priority: Notifications.AndroidNotificationPriority.MAX,
          data: {
            kind: PRAYER_NOTIFICATION_KIND,
            prayerKey: prayer.key,
            route: "/(tabs)/Prayers",
            scheduledFor: prayer.time.toISOString(),
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: prayer.time,
          channelId:
            Platform.OS === "android"
              ? PRAYER_NOTIFICATION_CHANNEL_ID
              : undefined,
        },
      });

      scheduledCount += 1;
    }
  }

  return scheduledCount;
};

export const openAndroidDndSettingsAsync = async () => {
  if (Platform.OS === "android") {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.NOTIFICATION_POLICY_ACCESS_SETTINGS,
    );
    return;
  }

  await Linking.openSettings();
};
