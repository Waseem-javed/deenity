import * as Location from "expo-location";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type LocationSnapshot = Coordinates & {
  city?: string | null;
  region?: string | null;
  country?: string | null;
};

export const MAKKAH_COORDINATES: Coordinates = {
  latitude: 21.4225,
  longitude: 39.8262,
};

export const normalizeDegrees = (degrees: number) =>
  ((degrees % 360) + 360) % 360;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

export const requestLocationAccess = async () => {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== "granted") {
    throw new Error(
      "Location access is needed to find Qibla and load prayer times.",
    );
  }

  return permission;
};

export const getCurrentLocationSnapshot =
  async (): Promise<LocationSnapshot> => {
    await requestLocationAccess();

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      mayShowUserSettingsDialog: true,
    });

    const { latitude, longitude } = position.coords;

    let place: Location.LocationGeocodedAddress | null = null;

    try {
      const [firstPlace] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      place = firstPlace ?? null;
    } catch {
      place = null;
    }

    return {
      latitude,
      longitude,
      city: place?.city ?? place?.district ?? null,
      region: place?.region ?? null,
      country: place?.country ?? null,
    };
  };

export const calculateQiblaBearing = ({ latitude, longitude }: Coordinates) => {
  const userLatitude = toRadians(latitude);
  const makkahLatitude = toRadians(MAKKAH_COORDINATES.latitude);
  const deltaLongitude = toRadians(MAKKAH_COORDINATES.longitude - longitude);

  const y = Math.sin(deltaLongitude);
  const x =
    Math.cos(userLatitude) * Math.tan(makkahLatitude) -
    Math.sin(userLatitude) * Math.cos(deltaLongitude);

  const bearing = toDegrees(Math.atan2(y, x));
  return normalizeDegrees(bearing);
};

export const getQiblaOffset = (heading: number, qiblaBearing: number) =>
  normalizeDegrees(qiblaBearing - heading);

export const watchDeviceHeading = async (
  onHeadingChange: (heading: number) => void,
) => {
  await requestLocationAccess();

  return Location.watchHeadingAsync((headingData) => {
    const nextHeading =
      headingData.trueHeading >= 0
        ? headingData.trueHeading
        : headingData.magHeading;

    onHeadingChange(normalizeDegrees(nextHeading || 0));
  });
};

export const formatLocationLabel = (
  location: Partial<LocationSnapshot> | null,
) => {
  if (!location) return "Unknown location";

  return (
    [location.city, location.region, location.country]
      .filter(Boolean)
      .join(", ") ||
    `${location.latitude?.toFixed(3)}, ${location.longitude?.toFixed(3)}`
  );
};
