import { useState } from "react";
import { NavLink, useParams } from "react-router";
import { Typography, Card, Empty, Button } from "antd";
import RestaurantList from "../components/RestaurantList";
import RestaurantFilter from "../components/RestaurantFilter";
import { useRestaurantFilters } from "../hooks/useRestaurantFilters";
import { useRestaurants } from "../hooks/useRestaurants";
import { SORT_OPTIONS, type SortOption } from "../constants/sortConstants";
import {
  MAX_RESTAURANT,
  MAX_RESTAURANT_PER_PAGE,
} from "../constants/restaurantConstants";
import { useLocation } from "../hooks/useLocation";

const { Title } = Typography;

export default function CuisineDetail() {
  const params = useParams<{ cuisineId: string }>();
  const cuisineId = params.cuisineId || "";
  const { coordinates } = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    selectedDistricts,
    setSelectedDistricts,
    sortBy,
    setSortBy,
    resetFilters,
  } = useRestaurantFilters();

  const { restaurants, isLoading } = useRestaurants(
    coordinates
      ? {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
          limit: MAX_RESTAURANT,
          foodtype: cuisineId,
        }
      : { limit: MAX_RESTAURANT, foodtype: cuisineId },
  );

  if (!cuisineId) {
    return (
      <main className="container min-h-screen">
        <Card className="container mx-auto my-8 px-4 py-8">
          <Empty
            description="Không tìm thấy ẩm thực"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <div className="mt-4 text-center">
            <NavLink to="/">
              <Button type="primary">Quay lại trang chủ</Button>
            </NavLink>
          </div>
        </Card>
      </main>
    );
  }

  let filteredRestaurants = [...restaurants];

  if (selectedDistricts.length > 0) {
    filteredRestaurants = filteredRestaurants.filter((restaurant) =>
      selectedDistricts.includes(restaurant.districtId),
    );
  }

  switch (sortBy) {
    case SORT_OPTIONS.RATING:
      filteredRestaurants.sort((a, b) => b.rating - a.rating);
      break;
    case SORT_OPTIONS.DISTANCE:
      filteredRestaurants.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      break;
    case SORT_OPTIONS.RELEVANCE:
    default:
      break;
  }

  const startIndex = (currentPage - 1) * MAX_RESTAURANT_PER_PAGE;
  const endIndex = startIndex + MAX_RESTAURANT_PER_PAGE;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  return (
    <main className="container min-h-screen">
      <div className="space-y-8">
        <Title level={2} className="mb-6">
          {cuisineId}
        </Title>

        <div className="relative">
          {/* Filters Section */}
          <RestaurantFilter
            selectedDistricts={selectedDistricts}
            sortBy={sortBy}
            onDistrictChange={setSelectedDistricts}
            onSortChange={(value: string) => setSortBy(value as SortOption)}
            onResetFilters={resetFilters}
          />

          {/* Results Section */}
          <div>
            <RestaurantList
              restaurants={paginatedRestaurants}
              totalResults={filteredRestaurants.length}
              currentPage={currentPage}
              pageSize={MAX_RESTAURANT_PER_PAGE}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              isLoading={isLoading}
              emptyMessage={`Không có quán ăn nào có ${cuisineId}`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
