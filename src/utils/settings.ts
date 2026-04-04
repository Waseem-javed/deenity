import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_STORAGE_KEY = "@deenity/settings";

export type AppSettings = {
  prayerAlerts: boolean;
  adhanSoundEnabled: boolean;
  dailyReminders: boolean;
  darkMode: boolean;
  biometricLock: boolean;
  autoSilentAtPrayer: boolean;
  arabicFontScale: "small" | "medium" | "large";
};

export const defaultAppSettings: AppSettings = {
  prayerAlerts: true,
  adhanSoundEnabled: true,
  dailyReminders: true,
  darkMode: false,
  biometricLock: true,
  autoSilentAtPrayer: false,
  arabicFontScale: "medium",
};

export const loadAppSettings = async (): Promise<AppSettings> => {
  try {
    const rawSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!rawSettings) {
      return defaultAppSettings;
    }

    return {
      ...defaultAppSettings,
      ...JSON.parse(rawSettings),
    };
  } catch {
    return defaultAppSettings;
  }
};

export const saveAppSettings = async (settings: AppSettings) => {
  await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  return settings;
};

export const updateAppSettings = async (partial: Partial<AppSettings>) => {
  const currentSettings = await loadAppSettings();
  const nextSettings = { ...currentSettings, ...partial };

  await saveAppSettings(nextSettings);
  return nextSettings;
};
