import { useSearchParams } from "react-router";
import { Typography } from "antd";
import { useSearch } from "../hooks/useSearch";
import { useRestaurantFilters } from "../hooks/useRestaurantFilters";
import RestaurantList from "../components/RestaurantList";
import RestaurantFilter from "../components/RestaurantFilter";
import type { SortOption } from "../constants/sortConstants";
import {
  MAX_RESTAURANT,
  MAX_RESTAURANT_PER_PAGE,
} from "../constants/restaurantConstants";

const { Title, Text } = Typography;

export default function Search() {
  const [searchParams] = useSearchParams();

  const {
    selectedDistricts,
    setSelectedDistricts,
    sortBy,
    setSortBy,
    resetFilters,
  } = useRestaurantFilters();

  const { isSearching, restaurants } = useSearch({
    limit: MAX_RESTAURANT,
  });

  const query = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");

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
            selectedDistricts={selectedDistricts}
            sortBy={sortBy}
            onDistrictChange={setSelectedDistricts}
            onSortChange={(value: string) => setSortBy(value as SortOption)}
            onResetFilters={resetFilters}
          />

          {/* Results Section */}
          <RestaurantList
            restaurants={restaurants || []}
            totalResults={restaurants?.length || 0}
            currentPage={currentPage}
            pageSize={MAX_RESTAURANT_PER_PAGE}
            onPageChange={(page) => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              searchParams.set("page", page.toString());
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
