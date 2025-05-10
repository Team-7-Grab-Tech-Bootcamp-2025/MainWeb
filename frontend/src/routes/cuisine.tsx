import { useState } from "react";
import { NavLink, useLoaderData, useParams } from "react-router";
import { Typography, Row, Col, Pagination, Card, Empty, Button } from "antd";
import RestaurantCard from "../components/RestaurantCard";

const { Title } = Typography;

// Mock data structure for loader
interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  keywords: string[];
  category: string;
}

interface CuisineData {
  id: string;
  name: string;
  description: string;
  restaurants: Restaurant[];
  totalRestaurants: number;
}

// This would be replaced with actual API calls in a real app
export async function clientLoader({
  params,
}: {
  params: { cuisineId: string };
}) {
  const cuisineId = params.cuisineId;
  // Mock cuisine data
  const cuisines = {
    italian: {
      id: "italian",
      name: "Italian Cuisine",
      description:
        "Experience the rich flavors of Italy with authentic pasta, pizza, and more.",
      restaurants: Array(24)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          name: `Italian Restaurant ${index + 1}`,
          image: `https://placehold.co/500x300?text=Italian+${index + 1}`,
          rating: 3.5 + Math.random() * 1.5,
          reviewCount: Math.floor(Math.random() * 500),
          keywords: ["Pasta", "Pizza", "Italian", "Wine"]
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 2) + 2),
          category: "Italian",
        })),
      totalRestaurants: 24,
    },
    chinese: {
      id: "chinese",
      name: "Chinese Cuisine",
      description: "Discover diverse flavors from different regions of China.",
      restaurants: Array(16)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          name: `Chinese Restaurant ${index + 1}`,
          image: `https://placehold.co/500x300?text=Chinese+${index + 1}`,
          rating: 3.5 + Math.random() * 1.5,
          reviewCount: Math.floor(Math.random() * 500),
          keywords: ["Noodles", "Dumplings", "Wok", "Authentic"]
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 2) + 2),
          category: "Chinese",
        })),
      totalRestaurants: 16,
    },
    // Add more cuisines as needed
  };

  // Return the data for the requested cuisine or a 404
  return cuisines[cuisineId as keyof typeof cuisines] || { notFound: true };
}

export default function CuisineDetail() {
  const cuisineData = useLoaderData() as CuisineData;
  const params = useParams<{ cuisineId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18; // Number of restaurants per page

  // If cuisine not found
  if ("notFound" in cuisineData) {
    return (
      <Card className="container mx-auto my-8 px-4 py-8">
        <Empty
          description={`Cuisine "${params.cuisineId}" not found`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div className="mt-4 text-center">
          <NavLink to="/">
            <Button type="primary">Back to Home</Button>
          </NavLink>
        </div>
      </Card>
    );
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRestaurants = cuisineData.restaurants.slice(
    startIndex,
    endIndex,
  );

  return (
    <div className="space-y-8">
      <Card className="container mx-auto px-4 py-8">
        <Title level={2} className="mb-2">
          {cuisineData.name}
        </Title>
        <p className="mb-8 text-gray-600">{cuisineData.description}</p>

        <Row gutter={[24, 24]}>
          {paginatedRestaurants.map((restaurant) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={restaurant.id}>
              <RestaurantCard
                name={restaurant.name}
                image={
                  restaurant.image ||
                  `https://placehold.co/400x300?text=${encodeURIComponent(restaurant.name)}`
                }
                rating={restaurant.rating}
                reviewCount={restaurant.reviewCount}
                keywords={restaurant.keywords}
                category={restaurant.category}
                onClick={() =>
                  console.log(`Selected restaurant: ${restaurant.name}`)
                }
              />
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        {cuisineData.totalRestaurants > pageSize && (
          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              total={cuisineData.totalRestaurants}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
