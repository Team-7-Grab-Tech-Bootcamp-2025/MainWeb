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
import { useState, useMemo } from "react";
import {
  CITIES,
  DISTRICTS,
  type CityKey,
} from "../constants/locationConstants";
import { SORT_OPTIONS } from "../constants/sortConstants";
import "./RestaurantFilter.css";

const { Text } = Typography;

interface RestaurantFilterProps {
  selectedDistricts: string[];
  sortBy: string;
  onDistrictChange: (value: string[]) => void;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
}

export default function RestaurantFilter({
  selectedDistricts,
  sortBy,
  onDistrictChange,
  onSortChange,
  onResetFilters,
}: RestaurantFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityKey>("HCM");
  const hasActiveFilters = selectedDistricts.length > 0;

  const availableDistricts = useMemo(
    () => DISTRICTS[selectedCity],
    [selectedCity],
  );

  const handleDistrictChange = (districtId: string, checked: boolean) => {
    if (checked) {
      onDistrictChange([...selectedDistricts, districtId]);
    } else {
      onDistrictChange(selectedDistricts.filter((id) => id !== districtId));
    }
  };

  const handleCityChange = (cityKey: CityKey) => {
    setSelectedCity(cityKey);
    onDistrictChange([]);
  };

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
              options={Object.entries(CITIES).map(([key, value]) => ({
                value: key,
                label: value,
              }))}
            />
          </div>

          <div>
            <Text strong className="filter-title">
              Quận
            </Text>
            <div className="filter-districts-list">
              {availableDistricts.map((district) => (
                <div key={district.id} className="filter-district-item">
                  <Checkbox
                    checked={selectedDistricts.includes(district.id)}
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
              <Radio
                value={SORT_OPTIONS.RELEVANCE}
                className="filter-radio-item"
              >
                Độ liên quan
              </Radio>
              <Radio value={SORT_OPTIONS.RATING} className="filter-radio-item">
                Điểm đánh giá
              </Radio>
              <Radio
                value={SORT_OPTIONS.DISTANCE}
                className="filter-radio-item"
              >
                Khoảng cách
              </Radio>
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
