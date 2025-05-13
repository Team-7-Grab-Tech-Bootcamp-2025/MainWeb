import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import { SORT_OPTIONS, type SortOption } from "../constants/sortConstants";
import {
  type CityKey,
  getCityKeyFromId,
  getCityIdFromKey,
} from "../constants/locationConstants";

export interface FilterState {
  selectedDistricts: string[];
  sortBy: string;
  selectedCity: CityKey;
  cityId: string | null; // Add cityId for API queries
}

export interface UseRestaurantFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  initialSortBy?: string;
  initialCity?: CityKey;
}

export const useRestaurantFilters = ({
  onFilterChange,
  initialSortBy = SORT_OPTIONS.RATING,
  initialCity = "HCM",
}: UseRestaurantFiltersProps = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>(initialSortBy as SortOption);
  const [selectedCity, setSelectedCity] = useState<CityKey>(initialCity);
  const isInitialMount = useRef(true);
  const previousFilters = useRef({
    districts: "",
    sort: initialSortBy,
    city: getCityIdFromKey(initialCity),
  });
  // Ref to track if a city change is in progress
  const cityChangeInProgress = useRef(false);

  // Memoize the city ID for API queries
  const cityId = useMemo(() => {
    return selectedCity === "ALL" ? null : getCityIdFromKey(selectedCity);
  }, [selectedCity]);

  // We don't need the memoized currentFilters anymore since we're passing fresh objects in callbacks

  // Load filters from URL when component mounts
  useEffect(() => {
    if (isInitialMount.current) {
      const districtsParam = searchParams.get("districts");
      const sortParam = searchParams.get("sort");
      const cityParam = searchParams.get("city");

      if (districtsParam) {
        setSelectedDistricts(districtsParam.split(","));
        previousFilters.current.districts = districtsParam;
      }
      if (
        sortParam &&
        Object.values(SORT_OPTIONS).includes(sortParam as SortOption)
      ) {
        setSortBy(sortParam as SortOption);
        previousFilters.current.sort = sortParam;
      }
      // Convert city ID to city key using optimized helper function
      if (cityParam) {
        setSelectedCity(getCityKeyFromId(cityParam));
        previousFilters.current.city = cityParam;
      }

      isInitialMount.current = false;
    }
  }, [searchParams, initialSortBy, initialCity]);

  // Handle district selection
  const setSelectedDistrictsCallback = useCallback(
    (districts: string[]) => {
      // Skip during city change to prevent conflicts
      if (cityChangeInProgress.current) return;

      setSelectedDistricts(districts);
      const districtsString = districts.join(",");

      // Only update if districts have changed
      if (previousFilters.current.districts !== districtsString) {
        previousFilters.current.districts = districtsString;

        setSearchParams(
          (prev) => {
            const newParams = new URLSearchParams(prev);
            if (districts.length > 0) {
              newParams.set("districts", districtsString);
            } else {
              newParams.delete("districts");
            }
            newParams.set("page", "1");
            return newParams;
          },
          { replace: true },
        );

        // Call the callback with updated filters
        onFilterChange?.({
          selectedDistricts: districts,
          sortBy,
          selectedCity,
          cityId,
        });
      }
    },
    [setSearchParams, onFilterChange, sortBy, selectedCity, cityId],
  );

  // Handle sort changes
  const setSortByCallback = useCallback(
    (sort: SortOption) => {
      if (previousFilters.current.sort !== sort) {
        setSortBy(sort);
        previousFilters.current.sort = sort;

        setSearchParams(
          (prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set("sort", sort);
            return newParams;
          },
          { replace: true },
        );

        // Call the callback with updated filters
        onFilterChange?.({
          selectedDistricts,
          sortBy: sort,
          selectedCity,
          cityId,
        });
      }
    },
    [setSearchParams, onFilterChange, selectedDistricts, selectedCity, cityId],
  );

  // Handle city changes
  const setSelectedCityCallback = useCallback(
    (city: CityKey) => {
      if (selectedCity !== city) {
        // Mark city change in progress
        cityChangeInProgress.current = true;

        const newCityId = city === "ALL" ? null : getCityIdFromKey(city);
        setSelectedCity(city);
        previousFilters.current.city = newCityId || "";

        // Clear districts when city changes
        setSelectedDistricts([]);
        previousFilters.current.districts = "";

        setSearchParams(
          (prev) => {
            const newParams = new URLSearchParams(prev);
            if (city === "ALL") {
              newParams.delete("city");
            } else {
              newParams.set("city", newCityId || "");
            }
            // Clear districts when city changes
            newParams.delete("districts");
            newParams.set("page", "1");
            return newParams;
          },
          { replace: true },
        );

        // Call the callback with updated filters
        onFilterChange?.({
          selectedDistricts: [],
          sortBy,
          selectedCity: city,
          cityId: newCityId,
        });

        // Reset city change flag after update
        setTimeout(() => {
          cityChangeInProgress.current = false;
        }, 0);
      }
    },
    [setSearchParams, onFilterChange, sortBy, selectedCity],
  );

  // Memoize the reset filters handler
  const resetFilters = useCallback(() => {
    cityChangeInProgress.current = true;

    setSelectedDistricts([]);
    setSortBy(initialSortBy as SortOption);
    setSelectedCity(initialCity);

    const initialCityId = getCityIdFromKey(initialCity);
    previousFilters.current = {
      districts: "",
      sort: initialSortBy,
      city: initialCityId,
    };

    // Keep only the search query
    const query = searchParams.get("q");
    setSearchParams(query ? { q: query } : {}, {
      replace: true,
    });

    // Call the callback with reset filters
    onFilterChange?.({
      selectedDistricts: [],
      sortBy: initialSortBy,
      selectedCity: initialCity,
      cityId: initialCityId === "0" ? null : initialCityId,
    });

    // Reset city change flag after update
    setTimeout(() => {
      cityChangeInProgress.current = false;
    }, 0);
  }, [
    initialSortBy,
    initialCity,
    searchParams,
    setSearchParams,
    onFilterChange,
  ]);

  return {
    selectedDistricts,
    setSelectedDistricts: setSelectedDistrictsCallback,
    sortBy,
    setSortBy: setSortByCallback,
    selectedCity,
    setSelectedCity: setSelectedCityCallback,
    cityId, // Expose cityId for API queries
    resetFilters,
    SORT_OPTIONS,
  };
};
