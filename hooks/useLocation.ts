import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Location as ILocation, LOCATIONS } from "../constants/locations";

interface UseLocationResult {
  location: ILocation | null;
  isGPS: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [isGPS, setIsGPS] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function getLocation() {
      setLoading(true);
      setError(null);

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          // Fall back to Reykjavík if no permission
          if (!cancelled) {
            setLocation(LOCATIONS[0]);
            setIsGPS(false);
          }
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (cancelled) return;

        // Try to reverse geocode for a friendly name
        const geocode = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });

        const cityName =
          geocode[0]?.city ||
          geocode[0]?.subregion ||
          geocode[0]?.region ||
          "Staðsetning þín";

        setLocation({
          name: cityName,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          region: geocode[0]?.region ?? "Ísland",
        });
        setIsGPS(true);
      } catch (e) {
        if (!cancelled) {
          setError("Gat ekki sótt staðsetningu");
          setLocation(LOCATIONS[0]);
          setIsGPS(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getLocation();
    return () => { cancelled = true; };
  }, [trigger]);

  return {
    location,
    isGPS,
    loading,
    error,
    refresh: () => setTrigger(t => t + 1),
  };
}
