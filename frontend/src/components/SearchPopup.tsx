import { Card, Flex, Typography, Rate, Image } from "antd";
import { useNavigate } from "react-router";
import type { Restaurant } from "../types/restaurant";
import LoadingDot from "./LoadingDot";
import {
  getRestaurantImage,
  getImagePlaceholder,
} from "../constants/backgroundConstants";
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
        body: { padding: 18 },
      }}
    >
      {isLoading ? (
        <Flex className="h-20" justify="center" align="center">
          <LoadingDot />
        </Flex>
      ) : results.length > 0 ? (
        <Flex vertical gap={2}>
          {results.map((restaurant) => (
            <Card
              style={{
                padding: 0,
              }}
              styles={{
                body: {
                  padding: 12,
                },
              }}
              variant="borderless"
              key={restaurant.id}
              className="search-popup-item"
              onClick={() => {
                onSelect(restaurant);
                navigate(`/restaurant/${restaurant.id}`);
              }}
            >
              <Flex align="center" gap={12}>
                <div className="search-popup-item-image">
                  <Image
                    src={getRestaurantImage(restaurant.id)}
                    alt={restaurant.name}
                    preview={false}
                    placeholder={true}
                    fallback={getImagePlaceholder(restaurant.id)}
                    width={64}
                    height={64}
                  />
                </div>
                <div className="search-popup-item-content">
                  <div className="search-popup-item-name">
                    {restaurant.name}
                  </div>
                  <Text className="search-popup-item-address">
                    {restaurant.address}
                  </Text>
                  <div className="search-popup-item-ratings">
                    <Rate
                      disabled
                      defaultValue={restaurant.rating}
                      count={1}
                      style={{ fontSize: "14px" }}
                    />
                    <Text type="secondary" className="text-xs">
                      {restaurant.rating.toFixed(1)}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      ({restaurant.reviewCount})
                    </Text>
                    <Text type="secondary" className="text-xs">
                      •
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {restaurant.foodTypeName}
                    </Text>
                  </div>
                </div>
              </Flex>
            </Card>
          ))}
        </Flex>
      ) : (
        isFetched && (
          <div className="search-popup-no-results">No results found</div>
        )
      )}
    </Card>
  );
}
