import { Typography } from "antd";
import { useLocation } from "../hooks/useLocation";
import { useRestaurants } from "../hooks/useRestaurants";
import { useRestaurantFilters } from "../hooks/useRestaurantFilters";
import { SORT_OPTIONS, type SortOption } from "../constants/sortConstants";
import RestaurantList from "../components/RestaurantList";
import RestaurantFilter from "../components/RestaurantFilter";
import { MAX_RESTAURANT_PER_PAGE } from "../constants/restaurantConstants";
import { useSearchParams } from "react-router";

const { Title } = Typography;

export default function Restaurants() {
  const { coordinates } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const {
    selectedDistricts,
    setSelectedDistricts,
    selectedCity,
    setSelectedCity,
    cityId,
    sortBy,
    setSortBy,
    resetFilters,
  } = useRestaurantFilters();

  const { restaurants, totalCount, isLoading } = useRestaurants(
    coordinates
      ? {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
          page: currentPage,
          district: selectedDistricts.join(","),
          city: cityId || undefined,
        }
      : {
          page: currentPage,
          district: selectedDistricts.join(","),
          city: cityId || undefined,
        },
  );

  switch (sortBy) {
    case SORT_OPTIONS.RATING:
      restaurants.sort((a, b) => b.rating - a.rating);
      break;
    case SORT_OPTIONS.DISTANCE:
      restaurants.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      break;
    case SORT_OPTIONS.REVIEW_COUNT:
      restaurants.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      break;
  }

  return (
    <main className="container min-h-screen">
      <div className="space-y-8">
        <Title level={2} className="mb-6">
          {coordinates ? "Quán ăn gần bạn" : "Tất cả quán ăn"}
        </Title>

        <div className="relative">
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
          <div>
            <RestaurantList
              restaurants={restaurants}
              totalResults={totalCount}
              currentPage={currentPage}
              pageSize={MAX_RESTAURANT_PER_PAGE}
              onPageChange={(page) => {
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  newParams.set("page", page.toString());
                  return newParams;
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              isLoading={isLoading}
              emptyMessage="Không tìm thấy quán ăn phù hợp"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
