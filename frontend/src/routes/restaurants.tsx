import { Typography, Card } from "antd";
import { useState } from "react";
import { useLocation } from "../hooks/useLocation";
import { useRestaurants } from "../hooks/useRestaurants";
import { useRestaurantFilters } from "../hooks/useRestaurantFilters";
import { SORT_OPTIONS, type SortOption } from "../constants/sortConstants";
import RestaurantList from "../components/RestaurantList";
import RestaurantFilter from "../components/RestaurantFilter";
import {
  MAX_RESTAURANT,
  MAX_RESTAURANT_PER_PAGE,
} from "../constants/restaurantConstants";

const { Title } = Typography;

export default function Restaurants() {
  const { coordinates } = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  // Use the filter hook
  const {
    selectedDistricts,
    setSelectedDistricts,
    sortBy,
    setSortBy,
    resetFilters,
  } = useRestaurantFilters();

  // Get restaurants with location if available
  const { restaurants, isLoading } = useRestaurants(
    coordinates
      ? {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
          limit: MAX_RESTAURANT,
        }
      : { limit: MAX_RESTAURANT },
  );

  // Filter and sort restaurants
  let filteredRestaurants = [...restaurants];

  // Apply district filter
  if (selectedDistricts.length > 0) {
    filteredRestaurants = filteredRestaurants.filter((restaurant) =>
      selectedDistricts.includes(restaurant.districtId),
    );
  }

  // Apply sorting
  switch (sortBy) {
    case SORT_OPTIONS.RATING:
      filteredRestaurants.sort((a, b) => b.rating - a.rating);
      break;
    case SORT_OPTIONS.DISTANCE:
      // Only sort by distance if coordinates are available
      if (coordinates) {
        filteredRestaurants.sort(
          (a, b) => (a.distance || 0) - (b.distance || 0),
        );
      }
      break;
    case SORT_OPTIONS.RELEVANCE:
    default:
      // Keep original order for relevance
      break;
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * MAX_RESTAURANT_PER_PAGE;
  const endIndex = startIndex + MAX_RESTAURANT_PER_PAGE;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  return (
    <main className="container min-h-screen">
      <div className="space-y-8">
        <Card className="container mx-auto px-4 py-8">
          <Title level={2} className="mb-6">
            {coordinates ? "Quán ăn gần bạn" : "Tất cả quán ăn"}
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
                emptyMessage="Không tìm thấy quán ăn phù hợp"
              />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
