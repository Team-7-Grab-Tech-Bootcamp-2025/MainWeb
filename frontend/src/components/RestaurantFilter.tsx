import {
  Space,
  Button,
  Typography,
  Checkbox,
  Divider,
  Radio,
  Select,
  Flex,
} from "antd";
import {
  ClearOutlined,
  FilterOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useState, useMemo, useCallback } from "react";
import {
  CITY_OPTIONS,
  ALL_DISTRICTS,
  type CityKey,
  getCityIdFromKey,
} from "../constants/locationConstants";
import { SORT_OPTIONS } from "../constants/sortConstants";
import "./RestaurantFilter.css";

const { Text } = Typography;

interface RestaurantFilterProps {
  selectedDistricts: string[];
  sortBy: string;
  selectedCity: CityKey;
  onDistrictChange: (value: string[]) => void;
  onSortChange: (value: string) => void;
  onCityChange: (value: CityKey) => void;
  onResetFilters: () => void;
  hasLocation?: boolean;
}

export default function RestaurantFilter({
  selectedDistricts,
  sortBy,
  selectedCity,
  onDistrictChange,
  onSortChange,
  onCityChange,
  onResetFilters,
  hasLocation = false,
}: RestaurantFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasActiveFilters = selectedDistricts.length > 0;

  // Memoize the available districts based on selected city
  const availableDistricts = useMemo(() => {
    if (selectedCity === "ALL") {
      return ALL_DISTRICTS;
    }
    const cityId = getCityIdFromKey(selectedCity);
    return ALL_DISTRICTS.filter((d) => d.cityId === cityId);
  }, [selectedCity]);

  // Memoize selected districts set for faster lookups
  const selectedDistrictsSet = useMemo(
    () => new Set(selectedDistricts),
    [selectedDistricts],
  );

  const handleDistrictChange = useCallback(
    (districtId: string, checked: boolean) => {
      if (checked) {
        onDistrictChange([...selectedDistricts, districtId]);
      } else {
        onDistrictChange(selectedDistricts.filter((id) => id !== districtId));
      }
    },
    [selectedDistricts, onDistrictChange],
  );

  const handleSelectAllDistricts = useCallback(
    (checked: boolean) => {
      if (checked) {
        onDistrictChange(availableDistricts.map((district) => district.id));
      } else {
        onDistrictChange([]);
      }
    },
    [availableDistricts, onDistrictChange],
  );

  const handleCityChange = useCallback(
    (cityKey: CityKey) => {
      onCityChange(cityKey);
    },
    [onCityChange],
  );

  const isAllDistrictsSelected = useMemo(
    () =>
      availableDistricts.length > 0 &&
      availableDistricts.every((district) =>
        selectedDistrictsSet.has(district.id),
      ),
    [availableDistricts, selectedDistrictsSet],
  );

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        type="primary"
        shape="circle"
        icon={<FilterOutlined />}
        onClick={() => setIsExpanded(!isExpanded)}
        className="filter-toggle-btn"
        size="large"
      >
        {hasActiveFilters && (
          <span className="filter-badge">{selectedDistricts.length}</span>
        )}
      </Button>

      {/* Filters Panel */}
      <div
        className={`filter-panel ${
          isExpanded ? "filter-panel-expanded" : "filter-panel-collapsed"
        }`}
      >
        <Space direction="vertical" size="small" className="w-full">
          <Flex align="center" justify="space-between">
            <Text strong>Bộ lọc</Text>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => setIsExpanded(false)}
            ></Button>
          </Flex>

          <Divider className="my-2" />

          <div>
            <Text strong className="filter-title">
              Thành phố
            </Text>
            <Select
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full"
              options={CITY_OPTIONS}
            />
          </div>

          <div>
            <Text strong className="filter-title">
              Quận
            </Text>
            <div
              className="filter-districts-list"
              style={{ maxHeight: 300, overflow: "auto" }}
            >
              <div className="filter-district-item">
                <Checkbox
                  checked={isAllDistrictsSelected}
                  onChange={(e) => handleSelectAllDistricts(e.target.checked)}
                >
                  Tất cả
                </Checkbox>
              </div>
              {availableDistricts.map((district) => (
                <div key={district.id} className="filter-district-item">
                  <Checkbox
                    checked={selectedDistrictsSet.has(district.id)}
                    onChange={(e) =>
                      handleDistrictChange(district.id, e.target.checked)
                    }
                  >
                    {district.name}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>

          <Divider className="my-2" />

          <div>
            <Text strong className="filter-title">
              Xếp theo
            </Text>
            <Radio.Group
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="filter-radio-group"
            >
              <Radio value={SORT_OPTIONS.RATING} className="filter-radio-item">
                Điểm đánh giá
              </Radio>
              <Radio
                value={SORT_OPTIONS.REVIEW_COUNT}
                className="filter-radio-item"
              >
                Số đánh giá
              </Radio>
              {hasLocation && (
                <Radio
                  value={SORT_OPTIONS.DISTANCE}
                  className="filter-radio-item"
                >
                  Khoảng cách
                </Radio>
              )}
            </Radio.Group>
          </div>

          <div
            className={`filter-reset-btn ${
              hasActiveFilters ? "animate-fade-in" : "filter-reset-btn-inactive"
            }`}
          >
            <Button
              type="primary"
              onClick={onResetFilters}
              block
              icon={<ClearOutlined />}
              disabled={!hasActiveFilters}
            >
              Xóa tất cả
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
}
