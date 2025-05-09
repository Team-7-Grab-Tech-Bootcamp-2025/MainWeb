import { Flex, Input } from "antd";
import { useSearch, useSearchResults } from "../hooks/useSearch";
import { useState, useEffect, useRef } from "react";
import SearchPopup from "./SearchPopup";
import { CloseCircleFilled } from "@ant-design/icons";
import { useDebounce } from "use-debounce";
import "./SearchBar.css";

interface SearchBarProps {
  placeholder?: string;
  size?: "small" | "middle" | "large";
  className?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Nhập tên quán ăn...",
  size = "middle",
  className = "",
}) => {
  const { searchTerm, setSearchTerm, performSearch, isSearching } = useSearch();
  const [showPopup, setShowPopup] = useState(false);
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [debouncedShouldShow] = useDebounce(shouldShowPopup, 300);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedShouldShow) {
      setShowPopup(true);
    }
  }, [debouncedShouldShow]);

  const {
    data: quickResults,
    isLoading: isQuickSearching,
    isFetched: isQuickSearchFetched,
  } = useSearchResults(1, {
    limit: 5,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
        setShouldShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (searchTerm.trim().length >= 1) {
      setShouldShowPopup(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShouldShowPopup(value.trim().length >= 1);
  };

  const handleSearch = () => {
    setShowPopup(false);
    setShouldShowPopup(false);
    performSearch(searchTerm);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm("");
    setShowPopup(false);
    setShouldShowPopup(false);
  };

  return (
    <Flex ref={searchBarRef} className="search-bar-container">
      <Input.Search
        placeholder={placeholder}
        enterButton
        size={size}
        value={searchTerm}
        onChange={handleChange}
        onSearch={handleSearch}
        onFocus={handleFocus}
        className={className}
        loading={isSearching}
        suffix={
          <CloseCircleFilled
            className={`search-bar-clear ${searchTerm ? "search-bar-clear-visible" : "search-bar-clear-hidden"}`}
            onClick={handleClear}
          />
        }
      />
      <SearchPopup
        results={quickResults || []}
        isLoading={isQuickSearching}
        visible={showPopup}
        onSelect={() => {
          setShowPopup(false);
          setShouldShowPopup(false);
        }}
        isFetched={isQuickSearchFetched}
      />
    </Flex>
  );
};

export default SearchBar;
