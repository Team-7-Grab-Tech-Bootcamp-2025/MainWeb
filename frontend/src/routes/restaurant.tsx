import { useParams, useNavigate } from "react-router";
import {
  Typography,
  Card,
  Rate,
  Tag,
  Tabs,
  Row,
  Col,
  Button,
  Flex,
  Space,
  Skeleton,
  List,
  Avatar,
  Pagination,
} from "antd";
import { EnvironmentOutlined, StarFilled } from "@ant-design/icons";
import RestaurantRatingHighlight from "../components/RestaurantRatingHighlight";
import {
  getImagePlaceholder,
  getRestaurantImage,
} from "../constants/backgroundConstants";
import { useRestaurant } from "../hooks/useRestaurants";
import { PLATFORM_ICONS, type Platform } from "../constants/platformConstants";
import {
  CITIES,
  DISTRICTS,
  type CityKey,
} from "../constants/locationConstants";
import type {
  Restaurant,
  RestaurantReview,
  MenuItem,
  RestaurantReviewLabel,
} from "../types/restaurant";
import { useState } from "react";
import {
  CATEGORY_NAMES_VN,
  type RatingCategory,
} from "../constants/categoryConstants";

const { Title, Text, Paragraph } = Typography;

export default function Restaurant() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [selectedLabel, setSelectedLabel] =
    useState<RestaurantReviewLabel>("food");
  const [currentPage, setCurrentPage] = useState(1);
  const { restaurant, menu, reviews, isLoading, isReviewsLoading } =
    useRestaurant(restaurantId || "", {
      label: selectedLabel,
      page: currentPage,
    });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLabelClick = (label: RestaurantReviewLabel) => {
    setSelectedLabel(label);
    setCurrentPage(1); // Reset to first page when changing label
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return { text: "Tuyệt vời", color: "green" };
    if (rating >= 4.0) return { text: "Rất tốt", color: "lime" };
    if (rating >= 3.5) return { text: "Tốt", color: "blue" };
    if (rating >= 3.0) return { text: "Trung bình", color: "orange" };
    return { text: "Không tốt", color: "red" };
  };

  if (isLoading) {
    return (
      <Card className="container mx-auto my-8 max-w-6xl">
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (!restaurant) {
    return (
      <Card className="container mx-auto my-8 max-w-6xl">
        <Flex vertical align="center">
          <Title level={4}>Không tìm thấy quán ăn</Title>
          <Button type="primary" onClick={handleGoBack}>
            Quay lại
          </Button>
        </Flex>
      </Card>
    );
  }

  const ratingLabel = getRatingLabel(restaurant.restaurant.rating || 0);

  const cityKey =
    restaurant.restaurant.cityId === "1" ? "HCM" : ("HN" as CityKey);
  const district =
    restaurant.restaurant.districtId && restaurant.restaurant.cityId
      ? DISTRICTS[cityKey].find(
          (d) => d.id === restaurant.restaurant.districtId,
        )
      : undefined;

  const categoryRatings = {
    food: restaurant.labels.food.rating,
    service: restaurant.labels.service.rating,
    delivery: restaurant.labels.delivery.rating,
    price: restaurant.labels.price.rating,
    ambience: restaurant.labels.ambience.rating,
  };

  const hasPlatformRatings =
    restaurant.platforms &&
    restaurant.ratingPlatforms &&
    restaurant.platforms.length > 0 &&
    restaurant.ratingPlatforms.some((rating) => rating > 0);

  return (
    <main className="relative min-h-screen">
      {/* Hero Image - Full Viewport Width that scrolls with page */}
      <div className="absolute top-0 left-1/2 h-96 w-full -translate-x-1/2">
        <img
          src={getRestaurantImage(restaurant.restaurant.id, true)}
          alt={restaurant.restaurant.name}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getImagePlaceholder(restaurant.restaurant.id);
            target.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="h-96"></div>

      <Flex vertical className="container" gap={12}>
        {/* Restaurant Info Card - Positioned above the main content */}
        <Card className="relative -mt-24 shadow-lg">
          <Title level={2} className="m-0">
            {restaurant.restaurant.name}
          </Title>
          <Flex align="center" gap="small" className="mt-2">
            <Rate
              disabled
              defaultValue={restaurant.restaurant.rating}
              className="text-base"
            />
            <Text className="relative -top-[1px]">
              {restaurant.restaurant.rating.toFixed(1)} (
              {restaurant.restaurant.reviewCount} reviews)
            </Text>
            <Tag color={ratingLabel.color}>
              <Flex align="center" gap={4}>
                <StarFilled />
                <span>{ratingLabel.text}</span>
              </Flex>
            </Tag>
          </Flex>
          <Flex align="center" gap="small" className="mt-2">
            <EnvironmentOutlined />
            <Text>{restaurant.restaurant.address}</Text>
          </Flex>
          <Space className="mt-2" wrap size={8}>
            <Tag color="orange" className="m-0">
              {restaurant.restaurant.foodTypeName}
            </Tag>
            {restaurant.restaurant.cityId && (
              <Tag className="m-0">{CITIES[cityKey]}</Tag>
            )}
            {district && <Tag className="m-0">{district.name}</Tag>}
          </Space>
        </Card>

        {/* Rating Highlight Component */}
        <RestaurantRatingHighlight
          categoryRatings={categoryRatings}
          averageRating={restaurant.restaurant.rating}
          onLabelClick={handleLabelClick}
          selectedLabel={selectedLabel}
        />

        <Row gutter={[16, 16]} className="mb-44">
          {/* Main Content Card */}
          <Col
            xs={{ span: 24, order: 2 }}
            xl={{
              span: hasPlatformRatings ? 16 : 24,
              order: 1,
            }}
          >
            <Card className="basis-2/3 overflow-hidden">
              {/* Restaurant Tabs */}
              <Tabs
                defaultActiveKey="reviews"
                items={[
                  {
                    key: "reviews",
                    label: "Đánh giá",
                    children: (
                      <div>
                        <Title level={4}>
                          Khách hàng nói gì về{" "}
                          {
                            CATEGORY_NAMES_VN[
                              selectedLabel.toLowerCase() as RatingCategory
                            ]
                          }{" "}
                          ở {restaurant.restaurant.name}
                        </Title>
                        {isReviewsLoading ? (
                          <List
                            itemLayout="vertical"
                            dataSource={[1, 2, 3]}
                            renderItem={() => (
                              <List.Item>
                                <Skeleton
                                  avatar
                                  paragraph={{ rows: 2 }}
                                  active
                                />
                              </List.Item>
                            )}
                          />
                        ) : (
                          <>
                            <List
                              itemLayout="vertical"
                              dataSource={reviews?.reviews || []}
                              renderItem={(review: RestaurantReview) => (
                                <List.Item>
                                  <List.Item.Meta
                                    avatar={
                                      <Avatar>{review.feedback[0]}</Avatar>
                                    }
                                    title={
                                      <Flex
                                        align="center"
                                        justify="space-between"
                                      >
                                        <Rate
                                          disabled
                                          defaultValue={review.rating}
                                          className="text-sm"
                                        />
                                        <Text type="secondary">
                                          {new Date(
                                            review.reviewTime,
                                          ).toLocaleDateString()}
                                        </Text>
                                      </Flex>
                                    }
                                  />
                                  <Paragraph className="mt-2">
                                    {review.feedback}
                                  </Paragraph>
                                </List.Item>
                              )}
                            />
                            {reviews && reviews.totalReviews > 0 && (
                              <div className="mt-4 flex justify-center">
                                <Pagination
                                  current={currentPage}
                                  total={reviews.totalReviews}
                                  pageSize={5}
                                  onChange={handlePageChange}
                                  showSizeChanger={false}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "menu",
                    label: "Menu",
                    children: (
                      <Row gutter={[16, 16]}>
                        {menu?.map((dish: MenuItem, index: number) => (
                          <Col xs={24} sm={12} md={8} key={index}>
                            <Card className="h-full">
                              <Flex align="center" justify="space-between">
                                <Title level={5} className="m-0">
                                  {dish.name}
                                </Title>
                                <Text strong>${dish.price.toFixed(2)}</Text>
                              </Flex>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>

          {hasPlatformRatings && (
            <Col xs={{ span: 24, order: 1 }} xl={{ span: 8, order: 2 }}>
              {/* Platform Ratings */}
              <Card title="Đánh giá từ các nền tảng" className="shadow-md">
                <Flex vertical gap={16}>
                  {restaurant.platforms!.map((platform, index) => {
                    const rating = restaurant.ratingPlatforms?.[index] || 0;
                    if (rating === 0) return null;

                    return (
                      <Card
                        key={index}
                        hoverable
                        style={{ backgroundColor: "white" }}
                      >
                        <Flex align="center" justify="space-between">
                          <Flex align="center" gap={8}>
                            <Avatar
                              src={
                                PLATFORM_ICONS[
                                  platform.toLowerCase() as Platform
                                ]
                              }
                              className="h-9 w-9"
                            />
                            <Text strong className="text-base">
                              {platform}
                            </Text>
                          </Flex>
                          <Flex align="center" gap={8}>
                            <Title
                              className="m-0 text-xl font-bold text-[var(--primary-color)]"
                              level={4}
                            >
                              {rating.toFixed(1)}
                            </Title>
                            <Rate
                              disabled
                              defaultValue={rating}
                              className="text-base text-[var(--foreground-color)]"
                            />
                          </Flex>
                        </Flex>
                      </Card>
                    );
                  })}
                </Flex>
              </Card>
            </Col>
          )}
        </Row>
      </Flex>
    </main>
  );
}
