import React, { useState, useRef, useEffect } from "react";
import { Typography, Rate, Tag, Flex, Divider, Card, theme } from "antd";
import { useNavigate } from "react-router";
import { StarFilled, EnvironmentOutlined } from "@ant-design/icons";
import {
  getImagePlaceholder,
  getRestaurantImage,
} from "../constants/backgroundConstants";
import "./RestaurantCard.css";

const { Title, Text } = Typography;
const { useToken } = theme;

interface RestaurantCardProps {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  address: string;
  distance?: number;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  rating,
  reviewCount = 0,
  categories,
  address,
  id,
  distance,
}) => {
  const { token } = useToken();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [expandedPosition, setExpandedPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsLargeScreen(isLarge);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const calculateCardPosition = () => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const cardRect = card.getBoundingClientRect();

    const centerS = cardRect.left + cardRect.width / 2;

    const expandedWidth = 360;

    const leftPosition = centerS - expandedWidth / 2;

    const topPosition = cardRect.top - 80;

    setExpandedPosition({
      left: leftPosition,
      top: topPosition,
    });
  };

  const handleMouseEnter = () => {
    if (!isLargeScreen) return;

    hoverTimerRef.current = setTimeout(() => {
      calculateCardPosition();
      setExpanded(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setExpanded(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (expanded) {
        setExpanded(false);
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [expanded]);

  const handleCardClick = () => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div
      className="restaurant-card-container"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <Card
        className="restaurant-card"
        cover={
          <div className="restaurant-card-image-container">
            <img
              src={getRestaurantImage(id)}
              alt={name}
              className="restaurant-card-image"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getImagePlaceholder(id);
                target.onerror = null;
              }}
            />
          </div>
        }
        styles={{
          body: { padding: "16px" },
        }}
      >
        <Title
          level={5}
          ellipsis={{ rows: 1 }}
          className="restaurant-card-title"
        >
          {name}
        </Title>

        <Flex align="center" className="mb-1" gap={6}>
          <Text className="restaurant-card-rating" ellipsis>
            {rating.toFixed(1)}
          </Text>
          <StarFilled className="restaurant-card-rating-icon" />
          <Text className="restaurant-card-review-count" ellipsis>
            ({reviewCount} đánh giá)
          </Text>
        </Flex>

        {distance !== undefined && distance > 0 && (
          <Tag
            className="restaurant-card-distance-tag"
            color="#c9938326"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="restaurant-card-distance-tag-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            }
          >
            {distance?.toFixed(1)} km
          </Tag>
        )}
        <div className="restaurant-card-categories">
          <Flex wrap="nowrap" className="overflow-hidden" gap={4}>
            {categories.slice(0, 2).map((category, index) => (
              <Tag.CheckableTag
                key={index}
                checked
                className="restaurant-card-category-tag"
              >
                {category}
              </Tag.CheckableTag>
            ))}
            {categories.length > 2 && (
              <Text className="restaurant-card-more-categories">
                +{categories.length - 2}
              </Text>
            )}
          </Flex>
        </div>
      </Card>

      {/* Expanded Card - Only shown on large screens */}
      {expanded && isLargeScreen && (
        <Card
          className="restaurant-card-expanded"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: token.boxShadowSecondary,
            top: `${expandedPosition.top}px`,
            left: `${expandedPosition.left}px`,
          }}
          cover={
            <div className="restaurant-card-expanded-image-container">
              <img
                src={getRestaurantImage(id)}
                alt={name}
                className="restaurant-card-expanded-image"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getImagePlaceholder(id);
                  target.onerror = null;
                }}
              />
            </div>
          }
        >
          <Title level={4} className="restaurant-card-expanded-title">
            {name}
          </Title>

          <Flex align="center" gap={8} className="mb-3">
            <Rate
              disabled
              defaultValue={rating}
              allowHalf
              style={{ fontSize: "16px" }}
            />
            <Text className="text-gray-500">
              {rating.toFixed(1)} ({reviewCount} đánh giá)
            </Text>
          </Flex>

          <Text className="restaurant-card-expanded-address">
            <span className="restaurant-card-expanded-address-label">
              Địa chỉ:
            </span>{" "}
            {address}
          </Text>

          {distance !== undefined && distance > 0 && (
            <div className="restaurant-card-expanded-distance">
              <EnvironmentOutlined className="restaurant-card-expanded-distance-icon" />
              <div>
                <Text className="restaurant-card-expanded-distance-label">
                  Cách bạn
                </Text>
                <Text className="restaurant-card-expanded-distance-value">
                  {distance.toFixed(1)} km
                </Text>
              </div>
            </div>
          )}

          <Divider className="my-3" />

          <Flex
            wrap
            gap={4}
            className="restaurant-card-expanded-categories-list"
          >
            <Text>Quán này bán:</Text>
            {categories.map((category, index) => (
              <Tag
                key={index}
                className="restaurant-card-expanded-category-tag"
              >
                {category}
              </Tag>
            ))}
          </Flex>
        </Card>
      )}
    </div>
  );
};
export default RestaurantCard;
