import { Typography, Row, Col, Card, Skeleton, Button } from "antd";
import { useNavigate } from "react-router";
import CuisineCard from "../components/CuisineCard";
import RestaurantCard from "../components/RestaurantCard";
import Hero from "../components/Hero";
import { useCuisines } from "../hooks/useCuisine";
import { useRestaurants } from "../hooks/useRestaurants";
import { useLocation } from "../hooks/useLocation";

const { Title } = Typography;

export default function Home() {
  const { data: cuisines, isLoading } = useCuisines();
  const { coordinates } = useLocation();
  const { restaurants, isLoading: isRestaurantsLoading } = useRestaurants(
    coordinates
      ? { lat: coordinates.latitude, lng: coordinates.longitude, limit: 8 }
      : { limit: 8 },
  );
  const navigate = useNavigate();

  const displayedCuisines = cuisines?.slice(0, 5) || [];
  const remainingCount = (cuisines?.length || 0) - displayedCuisines.length;

  const handleViewMore = () => {
    navigate("/restaurants");
  };

  return (
    <main className="container min-h-screen">
      <Hero
        title="Bạn muốn xem đánh giá quán ăn nào ?"
        subtitle="Nơi tổng hợp xếp hạng & nhận xét chân thực"
      />
      <div className="space-y-12">
        <Card className="container mx-auto px-4 py-8">
          <Title level={2} className="mb-6">
            Những ẩm thực có thể bạn sẽ thích
          </Title>
          {isLoading ? (
            <Row gutter={[24, 24]}>
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
                    <Card>
                      <Skeleton
                        active
                        paragraph={{ rows: 1 }}
                        className="h-[140px] w-full"
                      />
                    </Card>
                  </Col>
                ))}
            </Row>
          ) : cuisines && cuisines.length > 0 ? (
            <Row gutter={[24, 24]}>
              {displayedCuisines.map((cuisine, index) => (
                <Col xs={12} md={8} lg={6} xl={4} key={cuisine}>
                  <CuisineCard name={cuisine} index={index} />
                </Col>
              ))}
              {remainingCount > 0 && (
                <Col xs={12} md={8} lg={6} xl={4}>
                  <div
                    className="transform cursor-pointer transition-all duration-300 hover:-translate-y-2"
                    onClick={() => navigate("/cuisines")}
                  >
                    <div
                      className="relative h-[140px] overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
                      style={{ backgroundColor: "#7b8a65" }}
                    >
                      {/* Content */}
                      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[linear-gradient(-40deg,rgba(255,255,255,0.2),rgba(255,255,255,0)_40%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.2))] before:content-[''] after:absolute after:inset-0 after:bg-[url('/seigaiha.png')] after:-mask-linear-45 after:mask-linear-from-black after:mask-linear-to-transparent/40 after:bg-no-repeat after:opacity-40 after:content-['']" />
                      <div className="relative flex h-full items-center justify-center px-4 text-center">
                        <Title
                          level={4}
                          className="m-0 text-white"
                          ellipsis={{ rows: 1 }}
                        >
                          +{remainingCount} ẩm thực
                        </Title>
                      </div>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          ) : (
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <div>Không có dữ liệu</div>
              </Col>
            </Row>
          )}
        </Card>

        {/* Restaurant Section */}
        <Card className="container mx-auto px-4 py-8">
          <Title level={2} className="mb-6">
            {coordinates ? "Quán ăn nổi bật gần bạn" : "Quán ăn nổi bật"}
          </Title>

          {isRestaurantsLoading ? (
            <Row gutter={[24, 24]}>
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={index}>
                    <Card>
                      <Skeleton
                        active
                        paragraph={{ rows: 3 }}
                        className="h-[200px] w-full"
                      />
                    </Card>
                  </Col>
                ))}
            </Row>
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {restaurants.map((restaurant) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={restaurant.id}>
                    <RestaurantCard
                      id={restaurant.id}
                      name={restaurant.name}
                      rating={restaurant.rating}
                      reviewCount={restaurant.reviewCount}
                      categories={[restaurant.foodTypeName]}
                      distance={restaurant.distance}
                      address={restaurant.address}
                    />
                  </Col>
                ))}
              </Row>
              <div className="mt-8 flex justify-center">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleViewMore}
                  className="min-w-[200px]"
                >
                  Xem thêm
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
