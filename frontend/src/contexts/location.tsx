import { createContext, type ReactNode } from "react";
import { useLocation } from "../hooks/useLocation";
import type { Location } from "../types/location";

interface LocationContextType {
  coordinates: Location | null;
  loading: boolean;
  error: string | null;
  requested: boolean;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const locationState = useLocation();

  return (
    <LocationContext.Provider value={locationState}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext };
