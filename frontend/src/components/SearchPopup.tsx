import { Card, Flex, List, Typography } from "antd";
import { useNavigate } from "react-router";
import type { Restaurant } from "../types/restaurant";
import LoadingDot from "./LoadingDot";
import "./SearchPopup.css";

const { Text } = Typography;

interface SearchPopupProps {
  results: Restaurant[];
  isLoading: boolean;
  visible: boolean;
  onSelect: (restaurant: Restaurant) => void;
  isFetched: boolean;
}

export default function SearchPopup({
  results,
  isLoading,
  visible,
  onSelect,
  isFetched,
}: SearchPopupProps) {
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <Card
      className="search-popup animate-fade-in"
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      {isLoading ? (
        <Flex className="h-20" justify="center" align="center">
          <LoadingDot />
        </Flex>
      ) : results.length > 0 ? (
        <List
          size="small"
          dataSource={results}
          renderItem={(restaurant) => (
            <List.Item
              className="search-popup-item"
              onClick={() => {
                onSelect(restaurant);
                navigate(`/restaurant/${restaurant.id}`);
              }}
            >
              <div>
                <div className="search-popup-item-name">{restaurant.name}</div>
                <Flex gap={8} align="center">
                  <Text type="secondary" className="text-xs">
                    {restaurant.districtId}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    •
                  </Text>
                  <Text type="secondary" className="text-xs">
                    {restaurant.foodTypeName}
                  </Text>
                </Flex>
              </div>
            </List.Item>
          )}
        />
      ) : (
        isFetched && (
          <div className="search-popup-no-results">No results found</div>
        )
      )}
    </Card>
  );
}
