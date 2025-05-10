import { Row, Col, Pagination, Empty, Flex } from "antd";
import RestaurantCard from "./RestaurantCard";
import type { Restaurant } from "../types/restaurant";
import LoadingDot from "./LoadingDot";
import "./RestaurantList.css";

interface RestaurantListProps {
  restaurants: Restaurant[];
  totalResults: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function RestaurantList({
  restaurants,
  totalResults,
  currentPage,
  pageSize,
  onPageChange,
  isLoading = false,
  emptyMessage = "Không tìm thấy quán ăn",
}: RestaurantListProps) {
  return (
    <div className="restaurant-list-container">
      {isLoading ? (
        <Flex
          justify="center"
          align="center"
          className="restaurant-list-loading"
        >
          <LoadingDot />
        </Flex>
      ) : restaurants.length > 0 ? (
        <div>
          <Row
            gutter={[
              { xs: 12, sm: 24 },
              { xs: 12, sm: 24 },
            ]}
          >
            {restaurants.map((restaurant) => (
              <Col xs={12} md={8} lg={6} xl={4} key={restaurant.id}>
                <RestaurantCard
                  id={restaurant.id}
                  name={restaurant.name}
                  rating={restaurant.rating}
                  reviewCount={restaurant.reviewCount}
                  categories={[restaurant.districtId, restaurant.cityId]}
                  distance={restaurant.distance}
                  address={restaurant.address}
                />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalResults > pageSize && (
            <div className="restaurant-list-pagination">
              <Pagination
                current={currentPage}
                total={totalResults}
                pageSize={pageSize}
                onChange={onPageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      ) : (
        <Empty
          description={emptyMessage}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="restaurant-list-empty"
        />
      )}
    </div>
  );
}
