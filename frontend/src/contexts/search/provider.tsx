import React, { useState } from "react";
import type { ReactNode } from "react";
import { SearchContext } from "./context";

interface SearchProviderProps {
  children: ReactNode;
  onSearch?: (term: string, districts: string[]) => void;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({
  children,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const handleSearch = (term: string, districts: string[]) => {
    if (onSearch) {
      onSearch(term, districts);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        selectedDistricts,
        setSearchTerm,
        setSelectedDistricts,
        handleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
