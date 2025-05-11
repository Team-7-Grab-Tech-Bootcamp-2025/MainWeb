import { useQuery } from "@tanstack/react-query";
import { cuisineApi } from "../services/cuisineApi";

export const useCuisines = () => {
  return useQuery({
    queryKey: ["cuisines"],
    queryFn: cuisineApi.getAll,
  });
};

export const useCuisine = (id: string) => {
  return useQuery({
    queryKey: ["cuisine", id],
    queryFn: () => cuisineApi.getById(id),
    enabled: !!id,
  });
};
