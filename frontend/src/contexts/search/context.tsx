import { createContext } from "react";

interface SearchContextType {
  searchTerm: string;
  selectedDistricts: string[];
  setSearchTerm: (term: string) => void;
  setSelectedDistricts: (districts: string[]) => void;
  handleSearch: (term: string, districts: string[]) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined,
);
