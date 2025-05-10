import { useQuery } from "@tanstack/react-query";
import { restaurantApi } from "../services/restaurantApi";
import type { RestaurantListParams } from "../types/restaurant";

export const useRestaurants = (params?: RestaurantListParams) => {
  const { data: restaurants = [], isPending } = useQuery({
    queryKey: ["restaurants", "list", params],
    queryFn: () => restaurantApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });

  return {
    restaurants,
    isLoading: isPending,
  };
};

export const useRestaurant = (id: string) => {
  const { data: restaurant, isPending } = useQuery({
    queryKey: ["restaurants", "detail", id],
    queryFn: () => restaurantApi.getById(id),
    staleTime: 5 * 60 * 1000,
  });

  return {
    restaurant,
    isLoading: isPending,
  };
};

export const useSearchRestaurants = (params: {
  query?: string;
  district?: string[];
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
}) => {
  const { data: searchResults = [], isPending } = useQuery({
    queryKey: ["restaurants", "search", params],
    queryFn: () => restaurantApi.search(params),
    staleTime: 5 * 60 * 1000,
  });

  return {
    searchResults,
    isLoading: isPending,
  };
};
