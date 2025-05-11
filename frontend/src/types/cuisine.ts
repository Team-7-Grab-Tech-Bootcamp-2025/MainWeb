import type { Restaurant } from "./restaurant";

export interface Cuisine {
  id: string;
  name: string;
  restaurants: Restaurant[];
  totalRestaurants: number;
}

export interface CuisineListResponse {
  message: string;
  data: string[];
}

export interface CuisineDetailResponse {
  message: string;
  data: Cuisine;
}
