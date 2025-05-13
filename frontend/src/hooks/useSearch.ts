import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchContext } from "../contexts/search";
import { useNavigate } from "react-router";
import { restaurantApi } from "../services/restaurantApi";
import { useDebounce } from "use-debounce";
import { MAX_RESTAURANT } from "../constants/restaurantConstants";

export interface SearchFilters {
  limit?: number;
}

// Hook for quick search suggestions (used in SearchBar)
export const useQuickSearch = (limit: number = 5) => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useQuickSearch must be used within a SearchProvider");
  }

  const { searchTerm } = context;
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isCurrentlyUsing, setIsCurrentlyUsing] = useState(false);

  // Set a flag to indicate if we're on a search page
  useEffect(() => {
    const isSearchPage = window.location.pathname === "/search";
    setIsCurrentlyUsing(isSearchPage);
  }, []);

  // Query for quick search suggestions
  const { data: restaurants, isPending } = useQuery({
    queryKey: ["quickSearch", debouncedSearchTerm, { limit }],
    queryFn: () =>
      restaurantApi.search({
        query: debouncedSearchTerm,
        limit,
      }),
    enabled: !!debouncedSearchTerm?.trim() && isCurrentlyUsing,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  return {
    // Only show loading state when there's actually a search term
    isSearching: isPending && !!debouncedSearchTerm?.trim(),
    restaurants,
    setIsCurrentlyUsing,
  };
};

export const useSearch = (initialFilters: SearchFilters = {}) => {
  const context = useContext(SearchContext);
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    limit: MAX_RESTAURANT,
    ...initialFilters,
  });

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  const { searchTerm, setSearchTerm } = context;

  // Enhanced search function that handles navigation
  const performSearch = async (
    term: string,
    newFilters?: Partial<SearchFilters>,
  ) => {
    // Update search term
    setSearchTerm(term);
    setIsSearching(true);

    // Update filters if provided
    if (newFilters) {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    }

    // Only navigate if there is a search term
    if (term.trim()) {
      // Build query parameters for URL
      const params = new URLSearchParams();
      params.set("q", term.trim()); // Let URLSearchParams handle the encoding
      if (filters.limit) {
        params.set("limit", filters.limit.toString());
      }

      // Navigate to search page with query parameters
      navigate(`/search?${params.toString()}`);
    }

    setIsSearching(false);
  };

  // Update filters without triggering a new search
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  // Check if this is actually a search page with a query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const hasSearchQuery = urlParams.has("q");
  const searchQuery = urlParams.get("q") || "";

  // Query for search results (only triggered by search query changes)
  const { data: restaurants, isPending } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => {
      return restaurantApi.search({
        query: searchQuery,
        limit: filters.limit,
      });
    },
    enabled: hasSearchQuery && window.location.pathname === "/search",
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  return {
    // Search state
    searchTerm,
    setSearchTerm,
    isSearching: isSearching || isPending,
    performSearch,

    // Filters
    filters,
    updateFilters,

    // Results
    restaurants,
  };
};
