import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { SORT_OPTIONS, type SortOption } from "../constants/sortConstants";

export interface FilterState {
  selectedDistricts: string[];
  sortBy: string;
}

export interface UseRestaurantFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  initialSortBy?: string;
}

export const useRestaurantFilters = ({
  onFilterChange,
  initialSortBy = SORT_OPTIONS.RELEVANCE,
}: UseRestaurantFiltersProps = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>(initialSortBy as SortOption);

  // Memoize the current filter state
  const currentFilters = useMemo(
    () => ({
      selectedDistricts,
      sortBy,
    }),
    [selectedDistricts, sortBy],
  );

  // Load filters from URL when component mounts
  useEffect(() => {
    const districtsParam = searchParams.get("districts");
    const sortParam = searchParams.get("sort");

    if (districtsParam) {
      setSelectedDistricts(districtsParam.split(","));
    }
    if (
      sortParam &&
      Object.values(SORT_OPTIONS).includes(sortParam as SortOption)
    ) {
      setSortBy(sortParam as SortOption);
    }
  }, [searchParams, initialSortBy]);

  // Memoize the filter change handler
  const handleFilterChange = useCallback(() => {
    // Only update URL if filters have actually changed
    const currentDistricts = searchParams.get("districts");
    const currentSort = searchParams.get("sort");

    const districtsChanged = currentDistricts !== selectedDistricts.join(",");
    const sortChanged = currentSort !== sortBy;

    if (districtsChanged || sortChanged) {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);

          // Only update changed params
          if (districtsChanged) {
            if (selectedDistricts.length > 0) {
              newParams.set("districts", selectedDistricts.join(","));
            } else {
              newParams.delete("districts");
            }
          }

          if (sortChanged) {
            newParams.set("sort", sortBy);
          }

          // Reset to page 1 when filters change
          newParams.set("page", "1");

          return newParams;
        },
        { replace: true },
      ); // Use replace to avoid adding to history
    }

    // Call the callback if provided
    onFilterChange?.(currentFilters);
  }, [
    selectedDistricts,
    sortBy,
    setSearchParams,
    onFilterChange,
    currentFilters,
    searchParams,
  ]);

  // Memoize the reset filters handler
  const resetFilters = useCallback(() => {
    setSelectedDistricts([]);
    setSortBy(initialSortBy as SortOption);

    // Keep only the search query and reset page
    const query = searchParams.get("q");
    setSearchParams(query ? { q: query, page: "1" } : { page: "1" }, {
      replace: true,
    });
  }, [initialSortBy, searchParams, setSearchParams]);

  // Apply filters when they change
  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  // Memoize the setter functions to prevent unnecessary re-renders
  const setSelectedDistrictsCallback = useCallback((districts: string[]) => {
    setSelectedDistricts(districts);
  }, []);

  const setSortByCallback = useCallback((sort: SortOption) => {
    setSortBy(sort);
  }, []);

  return {
    selectedDistricts,
    setSelectedDistricts: setSelectedDistrictsCallback,
    sortBy,
    setSortBy: setSortByCallback,
    resetFilters,
    SORT_OPTIONS,
  };
};
