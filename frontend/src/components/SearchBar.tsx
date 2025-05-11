import { Flex, Input } from "antd";
import { useSearch, useQuickSearch } from "../hooks/useSearch";
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
  const { searchTerm, setSearchTerm, performSearch } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const { restaurants, isSearching, setIsCurrentlyUsing } = useQuickSearch(5);
  const [showPopup, setShowPopup] = useState(false);
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [debouncedShouldShow] = useDebounce(shouldShowPopup, 300);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedShouldShow) {
      setShowPopup(true);
    }
  }, [debouncedShouldShow]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
        setShouldShowPopup(false);
        setIsFocused(false);
        setIsCurrentlyUsing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsCurrentlyUsing]);

  const handleFocus = () => {
    setIsFocused(true);
    setIsCurrentlyUsing(true);
    if (searchTerm.trim().length >= 1) {
      setShouldShowPopup(true);
    }
  };

  const handleBlur = () => {
    // Don't immediately blur, as we might be clicking on the search results
    // The click outside handler will take care of this
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

  // Only show loading indicator when there's an actual search term and the search bar is focused
  const showLoading = isSearching && searchTerm.trim().length > 0 && isFocused;

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
        onBlur={handleBlur}
        className={className}
        loading={showLoading}
        suffix={
          <CloseCircleFilled
            className={`search-bar-clear ${searchTerm ? "search-bar-clear-visible" : "search-bar-clear-hidden"}`}
            onClick={handleClear}
          />
        }
      />
      <SearchPopup
        results={restaurants || []}
        isLoading={showLoading}
        visible={showPopup && isFocused}
        onSelect={() => {
          setShowPopup(false);
          setShouldShowPopup(false);
        }}
        isFetched={!isSearching}
      />
    </Flex>
  );
};

export default SearchBar;
