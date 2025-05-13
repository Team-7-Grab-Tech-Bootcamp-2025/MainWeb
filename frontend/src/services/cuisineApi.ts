import axios from "axios";
import type {
  Cuisine,
  CuisineListResponse,
  CuisineDetailResponse,
} from "../types/cuisine";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const transformCuisineName = (name: string): string => {
  return name === "Unknown" ? "Món khác" : name;
};

export const cuisineApi = {
  getAll: async (): Promise<string[]> => {
    const response = await api.get<CuisineListResponse>("/foodtypes");
    return response.data.data.map(transformCuisineName);
  },

  getById: async (id: string): Promise<Cuisine> => {
    const response = await api.get<CuisineDetailResponse>(`/foodtypes/${id}`);
    return {
      ...response.data.data,
      name: transformCuisineName(response.data.data.name),
    };
  },
};
