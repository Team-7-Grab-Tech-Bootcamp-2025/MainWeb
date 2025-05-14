import React from "react";
import { Typography, Image, Flex, Tag, Row, Col } from "antd";
import "./ChatMessage.css";
import { useQuery } from "@tanstack/react-query";
import { restaurantApi } from "../services/restaurantApi";
import RestaurantCard from "./RestaurantCard";
import LoadingDot from "./LoadingDot";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const { Paragraph } = Typography;

export type MessageType = "user" | "bot";

export interface ChatMessageProps {
  type: MessageType;
  content: string;
  images?: string[];
  restaurantIds?: string[];
  isLoading?: boolean;
}

const RestaurantSuggestion = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => restaurantApi.getById(id),
  });

  if (isLoading || !data) {
    return <Tag color="#c99383">Nhà hàng đang tải...</Tag>;
  }

  const { restaurant } = data;
  return (
    <RestaurantCard
      id={restaurant.id}
      name={restaurant.name}
      rating={restaurant.rating}
      reviewCount={restaurant.reviewCount}
      categories={[restaurant.foodTypeName]}
      address={restaurant.address}
      distance={restaurant.distance}
      disableExpand={true}
    />
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  images = [],
  restaurantIds = [],
  isLoading = false,
}) => {
  const hasImages = images && images.length > 0;
  const hasRestaurantIds = restaurantIds && restaurantIds.length > 0;

  return (
    <div
      className={`chat-message ${type === "user" ? "chat-message-user" : "chat-message-bot"}`}
    >
      <div className="chat-bubble">
        {isLoading && type === "bot" ? (
          <LoadingDot size={6} />
        ) : (
          <div className="chat-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}

        {hasRestaurantIds && (
          <div className="restaurant-suggestions">
            <Paragraph className="mb-1 text-base">Nhà hàng gợi ý:</Paragraph>
            <Row gutter={[16, 16]} className="restaurant-cards-container">
              {restaurantIds.map((id, index) => (
                <Col key={index} xs={24} sm={12} md={8}>
                  <RestaurantSuggestion id={id} />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {hasImages && (
          <Flex className="chat-images" wrap gap={8}>
            {images.map((imageUrl, index) => (
              <div key={index} className="chat-image-container">
                <Image
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="chat-image"
                  preview={{ mask: null }}
                  loading="lazy"
                />
              </div>
            ))}
          </Flex>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
