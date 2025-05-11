import { useQuery } from "@tanstack/react-query";
import { restaurantApi } from "../services/restaurantApi";
import type {
  RestaurantReviewsParams,
  RestaurantListParams,
} from "../types/restaurant";

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

export const useRestaurant = (
  id: string,
  reviewsParams?: Omit<RestaurantReviewsParams, "id">,
) => {
  const { data: restaurant, isPending: isRestaurantLoading } = useQuery({
    queryKey: ["restaurants", "detail", id],
    queryFn: () => restaurantApi.getById(id),
    staleTime: 5 * 60 * 1000,
  });

  const { data: menu, isPending: isMenuLoading } = useQuery({
    queryKey: ["restaurantMenu", id],
    queryFn: () => restaurantApi.getRestaurantMenu(id),
    staleTime: 5 * 60 * 1000,
  });

  const { data: reviews, isPending: isReviewsLoading } = useQuery({
    queryKey: ["restaurantReviews", { id, ...reviewsParams }],
    queryFn: () =>
      restaurantApi.getRestaurantReviews({
        id,
        ...reviewsParams,
      } as RestaurantReviewsParams),
    enabled: !!reviewsParams?.label && !!reviewsParams?.page,
    staleTime: 5 * 60 * 1000,
  });

  return {
    restaurant,
    menu,
    reviews,
    isReviewsLoading,
    isLoading: isRestaurantLoading || isMenuLoading,
  };
};
