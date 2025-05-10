import axios from "axios";
import type {
  Restaurant,
  RestaurantDetails,
  RestaurantListParams,
  RestaurantApiResponse,
  RestaurantDetailsApiResponse,
} from "../types/restaurant";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Transform snake_case to camelCase
const transformRestaurant = (data: RestaurantApiResponse): Restaurant => ({
  id: data.id,
  name: data.name,
  latitude: data.latitude,
  longitude: data.longitude,
  address: data.address,
  rating: data.rating,
  reviewCount: data.review_count,
  cityId: data.city_id,
  districtId: data.district_id,
  foodTypeName: data.food_type_name,
  distance: data.distance,
});

const transformRestaurantDetails = (
  data: RestaurantDetailsApiResponse,
): RestaurantDetails => ({
  restaurant: transformRestaurant(data.restaurant),
  dishes: data.dishes,
  labels: data.labels,
  platforms: data.platforms,
  ratingPlatforms: data.rating_platforms,
  reviews: data.reviews,
});

export const restaurantApi = {
  getAll: async (params?: RestaurantListParams): Promise<Restaurant[]> => {
    const response = await api.get<{ data: RestaurantApiResponse[] }>(
      "/restaurants",
      { params },
    );
    return response.data.data.map(transformRestaurant);
  },

  getById: async (id: string): Promise<RestaurantDetails> => {
    const response = await api.get<{ data: RestaurantDetailsApiResponse }>(
      `/restaurants/${id}`,
    );
    return transformRestaurantDetails(response.data.data);
  },

  search: async (params: {
    query?: string;
    district?: string[];
    page?: number;
    limit?: number;
    lat?: number;
    long?: number;
  }): Promise<Restaurant[]> => {
    const response = await api.get<{ data: RestaurantApiResponse[] }>(
      "/restaurants/search",
      { params },
    );
    return response.data.data.map(transformRestaurant);
  },
};
