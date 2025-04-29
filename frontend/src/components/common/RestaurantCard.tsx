import React from "react";
import { Typography, Rate, Tag, Flex } from "antd";

const { Title, Text } = Typography;

interface RestaurantCardProps {
  name: string;
  image: string;
  rating: number;
  reviewCount?: number;
  keywords: string[];
  category: string;
  onClick?: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  image,
  rating,
  reviewCount = 0,
  keywords,
  category,
  onClick,
}) => {
  return (
    <div
      className="cursor-pointer rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Tag color="orange" className="m-0 border-0">
            {category}
          </Tag>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <Title level={5} ellipsis={{ rows: 1 }} className="mb-1">
          {name}
        </Title>

        <Flex align="center" gap={8} className="mb-2">
          <Rate
            disabled
            defaultValue={rating}
            allowHalf
            className="text-sm"
            style={{ fontSize: "14px" }}
          />
          <Text className="text-sm text-gray-500">
            {rating.toFixed(1)} ({reviewCount})
          </Text>
        </Flex>

        <Flex wrap className="mt-2" gap={4} align="center">
          {keywords.slice(0, 4).map((keyword, index) => (
            <Tag.CheckableTag key={index} checked className="m-0">
              {keyword}
            </Tag.CheckableTag>
          ))}
          {keywords.length > 4 && (
            <Text className="text-xs text-gray-500">
              +{keywords.length - 4} more
            </Text>
          )}
        </Flex>
      </div>
    </div>
  );
};

export default RestaurantCard;
