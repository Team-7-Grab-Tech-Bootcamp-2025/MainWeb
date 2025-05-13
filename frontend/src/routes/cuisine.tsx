import { NavLink, useParams, useSearchParams } from "react-router";
import { Typography, Card, Empty, Button } from "antd";
import RestaurantList from "../components/RestaurantList";
import RestaurantFilter from "../components/RestaurantFilter";
import { useRestaurantFilters } from "../hooks/useRestaurantFilters";
import { useRestaurants } from "../hooks/useRestaurants";
import { SORT_OPTIONS, type SortOption } from "../constants/sortConstants";
import { MAX_RESTAURANT_PER_PAGE } from "../constants/restaurantConstants";
import { useLocation } from "../hooks/useLocation";

const { Title } = Typography;

export default function CuisineDetail() {
  const params = useParams<{ cuisineId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const cuisineId =
    (params.cuisineId || "") === "Món khác" ? "Unknown" : params.cuisineId;
  const cusineDisplay = params.cuisineId;
  const currentPage = Number(searchParams.get("page")) || 1;

  const { coordinates } = useLocation();

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
          foodtype: cuisineId,
          page: currentPage,
          district: selectedDistricts.join(","),
          city: cityId || undefined,
        }
      : {
          foodtype: cuisineId,
          page: currentPage,
          district: selectedDistricts.join(","),
          city: cityId || undefined,
        },
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
          {cusineDisplay}
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
              emptyMessage={`Không có quán ăn nào có ${cusineDisplay}`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
