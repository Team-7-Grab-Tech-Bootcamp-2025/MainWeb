import React, { useState, useRef, useEffect } from "react";
import { Input, Select, Tooltip } from "antd";
import { useSearch } from "../hooks/useSearch";

const { Option } = Select;

// Ho Chi Minh City districts
const districts = [
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 9",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Quận Bình Thạnh",
  "Quận Tân Bình",
  "Quận Tân Phú",
  "Quận Phú Nhuận",
  "Quận Gò Vấp",
  "Quận Thủ Đức",
  "Huyện Bình Chánh",
  "Huyện Nhà Bè",
  "Huyện Củ Chi",
  "Huyện Hóc Môn",
];

interface SearchBarProps {
  placeholder?: string;
  size?: "small" | "middle" | "large";
  className?: string;
  addonWidth?: number;
  maxTagCount?: number;
  // Add custom search handler prop
  onSearch?: (searchTerm: string) => void;
  // Add optional prop for initial value
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Nhập tên quán ăn...",
  size = "middle",
  className = "",
  addonWidth = 100,
  maxTagCount = 0,
  onSearch,
}) => {
  const {
    searchTerm,
    selectedDistricts,
    setSearchTerm,
    setSelectedDistricts,
    handleSearch,
  } = useSearch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Add scroll event listener to close dropdown when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dropdownOpen]);

  // Create a combined search handler
  const handleSearchWithCallback = (value: string) => {
    // Call the internal search handler
    handleSearch(value, selectedDistricts);

    // If external handler is provided, call it too
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Input.Search
      placeholder={placeholder}
      enterButton
      size={size}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onSearch={handleSearchWithCallback}
      className={className}
      addonBefore={
        <div ref={selectRef}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Quận"
            size={size}
            style={{ minWidth: addonWidth }}
            onChange={setSelectedDistricts}
            value={selectedDistricts}
            maxTagCount={maxTagCount}
            open={dropdownOpen}
            onDropdownVisibleChange={setDropdownOpen}
            dropdownStyle={{ maxHeight: "300px", overflow: "auto" }}
            maxTagPlaceholder={(omittedValues) => (
              <Tooltip
                styles={{ root: { pointerEvents: "none" } }}
                title={omittedValues.map(({ label }) => label).join(", ")}
              >
                <span>Hover Me</span>
              </Tooltip>
            )}
          >
            {districts.map((district) => (
              <Option key={district} value={district}>
                {district}
              </Option>
            ))}
          </Select>
        </div>
      }
    />
  );
};

export default SearchBar;
