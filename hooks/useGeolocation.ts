import { useState, useCallback } from "react";

export function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(async (): Promise<{ lat: number; lon: number } | null> => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolokalizacja nie jest wspierana");
      setLoading(false);
      return null;
    }
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setCoords(c);
          setLoading(false);
          resolve(c);
        },
        (err) => {
          setError("Brak dostępu do lokalizacji");
          setLoading(false);
          resolve(null);
          console.error("Błąd geolokalizacji:", err);
        }
      );
    });
  }, []);

  return { coords, error, loading, getLocation };
}
