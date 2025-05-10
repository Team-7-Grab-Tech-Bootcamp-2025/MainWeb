import { useState, useEffect, useContext } from "react";
import type { Location } from "../types/location";
import { LocationContext } from "../contexts/location";

interface LocationState {
  coordinates: Location | null;
  loading: boolean;
  error: string | null;
  requested: boolean;
  requestLocation: () => void;
}

export function useLocation(): LocationState {
  const [coordinates, setCoordinates] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requested, setRequested] = useState<boolean>(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Trình duyệt của bạn không hỗ trợ việc truy xuất vị trí");
      return;
    }

    setLoading(true);
    setRequested(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);

        localStorage.setItem("locationPermission", "granted");
        localStorage.setItem(
          "userLocation",
          JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
          }),
        );
      },
      (error) => {
        setError(
          error.code === 1
            ? "Quyền truy xuất vị trí đã bị từ chối. Bạn có thể bật nó trong cài đặt của bạn."
            : "Không thể truy xuất vị trí của bạn",
        );
        setLoading(false);
        localStorage.setItem("locationPermission", "denied");
      },
    );
  };

  useEffect(() => {
    const permission = localStorage.getItem("locationPermission");
    const storedLocation = localStorage.getItem("userLocation");

    if (permission === "granted" && storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        const locationAge = Date.now() - parsedLocation.timestamp;

        if (locationAge < 30 * 60 * 1000) {
          setCoordinates({
            latitude: parsedLocation.latitude,
            longitude: parsedLocation.longitude,
          });
          setRequested(true);
        } else {
          requestLocation();
        }
      } catch (e) {
        console.error("Failed to parse stored location:", e);
        requestLocation();
      }
    }
  }, []);

  return { coordinates, loading, error, requested, requestLocation };
}

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider",
    );
  }
  return context;
};
