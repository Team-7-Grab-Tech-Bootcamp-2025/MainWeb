import React, { useState, useRef, useEffect } from "react";
import { Typography, Rate, Tag, Flex, Divider, Card, theme } from "antd";

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

interface RestaurantCardProps {
  name: string;
  image: string;
  rating: number;
  reviewCount?: number;
  keywords: string[];
  category: string;
  description?: string;
  address?: string;
  onClick?: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  image,
  rating,
  reviewCount = 0,
  keywords,
  category,
  description = "Experience amazing cuisine at this restaurant.",
  address = "123 Food Street",
  onClick,
}) => {
  const { token } = useToken();
  const [expanded, setExpanded] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [expandedPosition, setExpandedPosition] = useState({ left: 0, top: 0 });

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      // Tailwind lg breakpoint is 1024px
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Initial check
    checkScreenSize();

    // Add listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const calculateCardPosition = () => {
    if (!cardRef.current) return;

    // Get the original card's position and dimensions
    const card = cardRef.current;
    const cardRect = card.getBoundingClientRect();

    // Find the center of the source card (center_S = Sx + Sw/2)
    const centerS = cardRect.left + cardRect.width / 2;

    // Width of the expanded card
    const expandedWidth = 360; // From the w-[360px] class

    // Calculate the left position of the expanded card (Bx = center_S - Bw/2)
    const leftPosition = centerS - expandedWidth / 2;

    // Calculate top position to be above the card
    const topPosition = cardRect.top - 80; // 50px above the original card

    setExpandedPosition({
      left: leftPosition,
      top: topPosition,
    });
  };

  const handleMouseEnter = () => {
    // Only enable hover expansion on large screens
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

  // Add scroll event listener to close expanded card when scrolling
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

  return (
    <div
      className="relative cursor-pointer"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Regular Card */}
      <Card
        className="overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
        cover={
          <div className="relative h-36 w-full overflow-hidden">
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
        }
        bodyStyle={{ padding: "16px" }}
      >
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

        {/* Tags - Limited to one row with fixed height */}
        <div className="relative h-8 overflow-hidden">
          <Flex wrap="nowrap" className="gap-1 overflow-hidden">
            {keywords.slice(0, 3).map((keyword, index) => (
              <Tag.CheckableTag
                key={index}
                checked
                className="m-0 whitespace-nowrap"
              >
                {keyword}
              </Tag.CheckableTag>
            ))}
            {keywords.length > 3 && (
              <Text className="ml-1 flex items-center text-xs text-gray-500">
                +{keywords.length - 3}
              </Text>
            )}
          </Flex>
        </div>
      </Card>

      {/* Expanded Card - Only shown on large screens */}
      {expanded && isLargeScreen && (
        <Card
          className="fixed z-50 w-[360px] origin-center animate-[var(--animate-zoom-from-point)] rounded-lg"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: token.boxShadowSecondary,
            top: `${expandedPosition.top}px`,
            left: `${expandedPosition.left}px`,
          }}
          cover={
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Tag color="orange" className="m-0 border-0">
                  {category}
                </Tag>
              </div>
            </div>
          }
        >
          <Title level={4} className="mb-2">
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
              {rating.toFixed(1)} ({reviewCount} reviews)
            </Text>
          </Flex>

          <Paragraph className="mb-3 text-gray-600">{description}</Paragraph>

          <Text className="mb-4 block text-gray-600">
            <span className="font-semibold">Address:</span> {address}
          </Text>

          <Divider className="my-3" />

          <div>
            <Text className="mb-2 block font-semibold">Features:</Text>
            <Flex wrap gap={4} className="mb-2">
              {keywords.map((keyword, index) => (
                <Tag key={index} className="m-0">
                  {keyword}
                </Tag>
              ))}
            </Flex>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RestaurantCard;
