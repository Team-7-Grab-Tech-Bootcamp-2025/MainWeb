import axios from "axios";
import type {
  Cuisine,
  CuisineListResponse,
  CuisineDetailResponse,
} from "../types/cuisine";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const cuisineApi = {
  getAll: async (): Promise<string[]> => {
    const response = await api.get<CuisineListResponse>("/foodtypes");
    return response.data.data;
  },

  getById: async (id: string): Promise<Cuisine> => {
    const response = await api.get<CuisineDetailResponse>(`/foodtypes/${id}`);
    return response.data.data;
  },
};
