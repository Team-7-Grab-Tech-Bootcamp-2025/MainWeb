import React from "react";
import { Typography, Image, Flex, Tag } from "antd";
import "./ChatMessage.css";
import { NavLink } from "react-router";

const { Paragraph } = Typography;

export type MessageType = "user" | "bot";

export interface ChatMessageProps {
  type: MessageType;
  content: string;
  images?: string[];
  restaurantIds?: string[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  images = [],
  restaurantIds = [],
}) => {
  const hasImages = images && images.length > 0;
  const hasRestaurantIds = restaurantIds && restaurantIds.length > 0;

  return (
    <div
      className={`chat-message ${type === "user" ? "chat-message-user" : "chat-message-bot"}`}
    >
      <div className="chat-bubble">
        <Paragraph className="chat-content">{content}</Paragraph>

        {hasRestaurantIds && (
          <Flex
            className="restaurant-tags"
            wrap
            gap={4}
            style={{ marginBottom: "8px" }}
          >
            {restaurantIds.map((id, index) => (
              <NavLink
                to={`/restaurant/${id}`}
                key={index}
                className="transition-all duration-300 hover:scale-105"
              >
                <Tag bordered={false} color="#c99383" key={index}>
                  Nhà hàng {index + 1}
                </Tag>
              </NavLink>
            ))}
          </Flex>
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
