import Constants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";
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
const EXPO_GO_NOTIFICATION_MESSAGE =
  "Prayer notifications are not available in Expo Go on Android. Use a development build to test scheduled alerts and adhan sound.";

const isExpoGoAndroid =
  Platform.OS === "android" &&
  (Constants.appOwnership === "expo" ||
    Constants.executionEnvironment === "storeClient");

const getNotificationsModuleAsync = async () => {
  if (isExpoGoAndroid) {
    return null;
  }

  return import("expo-notifications");
};

export const configureNotificationHandling = async () => {
  const Notifications = await getNotificationsModuleAsync();

  if (!Notifications) {
    return false;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  return true;
};

export const registerNotificationResponseListener = async (
  onRoute: (route: string) => void,
) => {
  const Notifications = await getNotificationsModuleAsync();

  if (!Notifications) {
    return () => {};
  }

  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const route = response.notification.request.content.data?.route;

      if (typeof route === "string") {
        onRoute(route);
      }
    },
  );

  return () => {
    subscription.remove();
  };
};

export const requestNotificationPermissionsAsync = async () => {
  const Notifications = await getNotificationsModuleAsync();

  if (!Notifications) {
    throw new Error(EXPO_GO_NOTIFICATION_MESSAGE);
  }

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
  const Notifications = await getNotificationsModuleAsync();

  if (!Notifications) {
    return 0;
  }

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
  const Notifications = await getNotificationsModuleAsync();

  if (!Notifications || Platform.OS !== "android") {
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
  const Notifications = await getNotificationsModuleAsync();

  if (!Notifications) {
    throw new Error(EXPO_GO_NOTIFICATION_MESSAGE);
  }

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
