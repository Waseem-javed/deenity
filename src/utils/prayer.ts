import {
    Coordinates as AdhanCoordinates,
    CalculationMethod,
    Madhab,
    PrayerTimes,
} from "adhan";
import { formatLocationLabel, type LocationSnapshot } from "./location";

const PRAYER_LABELS = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
  none: "None",
} as const;

export type PrayerKey = Exclude<keyof typeof PRAYER_LABELS, "none">;

export type PrayerEntry = {
  key: PrayerKey;
  label: string;
  time: Date;
  isCurrent: boolean;
  isNext: boolean;
};

export type PrayerOverview = {
  location: LocationSnapshot;
  locationLabel: string;
  gregorianDate: string;
  hijriDate: string;
  currentPrayer: {
    key: PrayerKey;
    label: string;
    start: Date;
    end: Date;
  };
  nextPrayer: {
    key: PrayerKey;
    label: string;
    time: Date;
  };
  prayers: PrayerEntry[];
};

const addDays = (date: Date, amount: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
};

const createPrayerTimes = (location: LocationSnapshot, date: Date) => {
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Hanafi;

  const coordinates = new AdhanCoordinates(
    location.latitude,
    location.longitude,
  );

  return new PrayerTimes(coordinates, date, params);
};

const getPrayerTimeForKey = (prayerTimes: PrayerTimes, key: PrayerKey) => {
  switch (key) {
    case "fajr":
      return prayerTimes.fajr;
    case "sunrise":
      return prayerTimes.sunrise;
    case "dhuhr":
      return prayerTimes.dhuhr;
    case "asr":
      return prayerTimes.asr;
    case "maghrib":
      return prayerTimes.maghrib;
    case "isha":
      return prayerTimes.isha;
  }
};

const resolveCurrentPrayerKey = (
  currentPrayer: keyof typeof PRAYER_LABELS | null,
  now: Date,
  todayPrayerTimes: PrayerTimes,
): PrayerKey => {
  if (currentPrayer && currentPrayer !== "none") {
    return currentPrayer as PrayerKey;
  }

  return now < todayPrayerTimes.fajr ? "isha" : "fajr";
};

const getPrayerRange = (
  key: PrayerKey,
  now: Date,
  yesterdayPrayerTimes: PrayerTimes,
  todayPrayerTimes: PrayerTimes,
  tomorrowPrayerTimes: PrayerTimes,
) => {
  switch (key) {
    case "fajr":
      return { start: todayPrayerTimes.fajr, end: todayPrayerTimes.sunrise };
    case "sunrise":
      return {
        start: todayPrayerTimes.sunrise,
        end: todayPrayerTimes.dhuhr,
      };
    case "dhuhr":
      return { start: todayPrayerTimes.dhuhr, end: todayPrayerTimes.asr };
    case "asr":
      return { start: todayPrayerTimes.asr, end: todayPrayerTimes.maghrib };
    case "maghrib":
      return {
        start: todayPrayerTimes.maghrib,
        end: todayPrayerTimes.isha,
      };
    case "isha":
      return now < todayPrayerTimes.fajr
        ? { start: yesterdayPrayerTimes.isha, end: todayPrayerTimes.fajr }
        : { start: todayPrayerTimes.isha, end: tomorrowPrayerTimes.fajr };
  }
};

const getNextPrayerTime = (
  key: PrayerKey,
  now: Date,
  todayPrayerTimes: PrayerTimes,
  tomorrowPrayerTimes: PrayerTimes,
) => {
  if (key === "fajr" && now >= todayPrayerTimes.isha) {
    return tomorrowPrayerTimes.fajr;
  }

  return getPrayerTimeForKey(todayPrayerTimes, key);
};

export const formatPrayerTime = (date?: Date | null) => {
  if (!date) return "--:--";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const formatGregorianDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formatHijriDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const buildPrayerOverview = (
  location: LocationSnapshot,
  date = new Date(),
): PrayerOverview => {
  const todayPrayerTimes = createPrayerTimes(location, date);
  const yesterdayPrayerTimes = createPrayerTimes(location, addDays(date, -1));
  const tomorrowPrayerTimes = createPrayerTimes(location, addDays(date, 1));

  const rawCurrentPrayer = todayPrayerTimes.currentPrayer() as
    | keyof typeof PRAYER_LABELS
    | null;
  const rawNextPrayer = todayPrayerTimes.nextPrayer() as
    | keyof typeof PRAYER_LABELS
    | null;

  const currentPrayerKey = resolveCurrentPrayerKey(
    rawCurrentPrayer,
    date,
    todayPrayerTimes,
  );
  const nextPrayerKey =
    rawNextPrayer && rawNextPrayer !== "none"
      ? (rawNextPrayer as PrayerKey)
      : "fajr";

  const currentPrayerRange = getPrayerRange(
    currentPrayerKey,
    date,
    yesterdayPrayerTimes,
    todayPrayerTimes,
    tomorrowPrayerTimes,
  );

  const prayerKeys: PrayerKey[] = [
    "fajr",
    "sunrise",
    "dhuhr",
    "asr",
    "maghrib",
    "isha",
  ];

  const prayers: PrayerEntry[] = prayerKeys.map((key) => ({
    key,
    label: PRAYER_LABELS[key],
    time: getPrayerTimeForKey(todayPrayerTimes, key),
    isCurrent: key === currentPrayerKey,
    isNext: key === nextPrayerKey,
  }));

  return {
    location,
    locationLabel: formatLocationLabel(location),
    gregorianDate: formatGregorianDate(date),
    hijriDate: formatHijriDate(date),
    currentPrayer: {
      key: currentPrayerKey,
      label: PRAYER_LABELS[currentPrayerKey],
      start: currentPrayerRange.start,
      end: currentPrayerRange.end,
    },
    nextPrayer: {
      key: nextPrayerKey,
      label: PRAYER_LABELS[nextPrayerKey],
      time: getNextPrayerTime(
        nextPrayerKey,
        date,
        todayPrayerTimes,
        tomorrowPrayerTimes,
      ),
    },
    prayers,
  };
};
