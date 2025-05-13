import { useSearchParams } from "react-router";
import { Typography } from "antd";
import { useSearch } from "../hooks/useSearch";
import { useRestaurantFilters } from "../hooks/useRestaurantFilters";
import RestaurantList from "../components/RestaurantList";
import RestaurantFilter from "../components/RestaurantFilter";
import { SORT_OPTIONS, type SortOption } from "../constants/sortConstants";
import {
  MAX_RESTAURANT,
  MAX_RESTAURANT_PER_PAGE,
} from "../constants/restaurantConstants";
import { useState } from "react";
import { useLocation } from "../hooks/useLocation";

const { Title, Text } = Typography;

export default function Search() {
  const [searchParams] = useSearchParams();
  const { coordinates } = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    selectedDistricts,
    setSelectedDistricts,
    selectedCity,
    setSelectedCity,
    sortBy,
    setSortBy,
    resetFilters,
  } = useRestaurantFilters();

  const { isSearching, restaurants } = useSearch({
    limit: MAX_RESTAURANT,
  });

  const query = searchParams.get("q") || "";

  let filteredRestaurants = [...(restaurants || [])];

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
    case SORT_OPTIONS.REVIEW_COUNT:
      filteredRestaurants.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      break;
  }

  const startIndex = (currentPage - 1) * MAX_RESTAURANT_PER_PAGE;
  const endIndex = startIndex + MAX_RESTAURANT_PER_PAGE;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  return (
    <main className="container min-h-screen">
      <div className="space-y-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Title level={2} className="mb-2">
              Search Results
            </Title>
            {!isSearching && restaurants?.length ? (
              <Text type="secondary">
                Found {restaurants.length} results for "{query}"
              </Text>
            ) : null}
          </div>

          {/* Filters Section */}
          <RestaurantFilter
            selectedCity={selectedCity}
            selectedDistricts={selectedDistricts}
            sortBy={sortBy}
            onDistrictChange={setSelectedDistricts}
            onSortChange={(value: string) => setSortBy(value as SortOption)}
            onCityChange={setSelectedCity}
            onResetFilters={resetFilters}
            hasLocation={!!coordinates}
          />

          {/* Results Section */}
          <RestaurantList
            restaurants={paginatedRestaurants || []}
            totalResults={filteredRestaurants.length || 0}
            currentPage={currentPage}
            pageSize={MAX_RESTAURANT_PER_PAGE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            isLoading={isSearching}
            emptyMessage={
              query
                ? "Không tìm thấy quán ăn phù hợp"
                : "Sử dụng thanh tìm kiếm ở đầu trang để tìm kiếm"
            }
          />
        </div>
      </div>
    </main>
  );
}
