import { Typography, Row, Col, Card } from "antd";
import { useLoaderData } from "react-router";
import CuisineCard from "../components/CuisineCard";
import RestaurantCard from "../components/RestaurantCard";
import type { Route } from "../+types/root";
import Hero from "../components/Hero";

const { Title } = Typography;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  console.log("clientLoader params", params);
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Explore Cuisines",
        mockHeroProps: {
          title: "Bạn muốn xem đánh giá quán ăn nào ?",
          subtitle: "Nơi tổng hợp xếp hạng & nhận xét chân thực",
        },
        cuisines: [
          {
            id: 1,
            name: "Italian",
            image:
              "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=2080",
            description: "Classic pasta, pizza, and Mediterranean flavors",
          },
          {
            id: 2,
            name: "Chinese",
            image:
              "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2129",
            description: "Diverse flavors from different regions of China",
          },
          {
            id: 3,
            name: "Mexican",
            image:
              "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=2080",
            description: "Vibrant, spicy dishes with corn and beans",
          },
          {
            id: 4,
            name: "Japanese",
            image:
              "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=2080",
            description: "Sushi, ramen, and other traditional favorites",
          },
          {
            id: 5,
            name: "Indian",
            image:
              "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=2080",
            description: "Rich spices and diverse regional dishes",
          },
          {
            id: 6,
            name: "French",
            image:
              "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2129",
            description: "Elegant dishes with a focus on technique",
          },
        ],
        restaurants: [
          {
            id: 1,
            name: "Pasta Paradise",
            image:
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070",
            rating: 4.7,
            reviewCount: 253,
            keywords: ["Pasta", "Italian", "Wine", "Cozy"],
            category: "Italian",
          },
          {
            id: 2,
            name: "Sushi Sensation",
            image:
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070",
            rating: 4.9,
            reviewCount: 412,
            keywords: ["Sushi", "Japanese", "Fresh", "Elegant"],
            category: "Japanese",
          },
          {
            id: 3,
            name: "Taco Fiesta",
            image:
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074",
            rating: 4.5,
            reviewCount: 187,
            keywords: ["Tacos", "Mexican", "Spicy", "Casual"],
            category: "Mexican",
          },
          {
            id: 4,
            name: "Beijing Kitchen",
            image:
              "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070",
            rating: 4.6,
            reviewCount: 320,
            keywords: ["Authentic", "Chinese", "Noodles", "Family-style"],
            category: "Chinese",
          },
          {
            id: 5,
            name: "Curry House",
            image:
              "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=2080",
            rating: 4.8,
            reviewCount: 275,
            keywords: ["Curry", "Indian", "Spices", "Vegetarian", "Vegan"],
            category: "Indian",
          },
          {
            id: 6,
            name: "Bistro Belle",
            image:
              "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2129",
            rating: 4.4,
            reviewCount: 198,
            keywords: ["French", "Elegant", "Wine", "Romantic"],
            category: "French",
          },
        ],
      });
    }, 1000);
  });
}

export default function Home() {
  const { mockHeroProps, cuisines, restaurants } = useLoaderData() as {
    mockHeroProps: {
      title: string;
      subtitle: string;
    };
    cuisines: Array<{
      id: number;
      name: string;
      image: string;
      description?: string;
    }>;
    restaurants: Array<{
      id: number;
      name: string;
      image: string;
      rating: number;
      reviewCount: number;
      keywords: string[];
      category: string;
    }>;
  };

  return (
    <>
      <Hero title={mockHeroProps.title} subtitle={mockHeroProps.subtitle} />
      <div className="space-y-12">
        <Card className="container mx-auto px-4 py-8">
          <Title level={2} className="mb-6">
            Popular Cuisines
          </Title>

          <Row gutter={[24, 24]}>
            {cuisines.map((cuisine) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={cuisine.id}>
                <CuisineCard
                  name={cuisine.name}
                  image={cuisine.image}
                  description={cuisine.description}
                />
              </Col>
            ))}
          </Row>
        </Card>

        {/* Restaurant Section */}
        <Card className="container mx-auto px-4 py-8">
          <Title level={2} className="mb-6">
            Top-rated Restaurants
          </Title>

          <Row gutter={[24, 24]}>
            {restaurants.map((restaurant) => (
              <Col xs={24} sm={12} md={8} lg={6} key={restaurant.id}>
                <RestaurantCard
                  name={restaurant.name}
                  image={restaurant.image}
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
        </Card>
      </div>
    </>
  );
}
