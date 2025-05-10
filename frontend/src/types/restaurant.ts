export interface Restaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  rating: number;
  reviewCount: number;
  cityId: string;
  districtId: string;
  foodTypeName: string;
  distance: number;
}

export interface RestaurantReview {
  rating: number;
  feedback: string;
  reviewTime: string;
}

export interface RestaurantLabel {
  rating: number;
  count: number;
}

export interface RestaurantDetails {
  restaurant: Restaurant;
  dishes: {
    name: string;
    price: number;
  }[];
  labels: {
    ambience: RestaurantLabel;
    delivery: RestaurantLabel;
    food: RestaurantLabel;
    price: RestaurantLabel;
    service: RestaurantLabel;
  };
  platforms: string[] | null;
  ratingPlatforms: number[] | null;
  reviews: RestaurantReview[];
}

export interface RestaurantListResponse {
  message: string;
  data: Restaurant[];
}

export interface RestaurantDetailResponse {
  message: string;
  data: RestaurantDetails;
}

export interface RestaurantListParams {
  lat?: number;
  lng?: number;
  limit?: number;
}

// API Response Types (snake_case)
export interface RestaurantApiResponse {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  rating: number;
  review_count: number;
  city_id: string;
  district_id: string;
  food_type_name: string;
  distance: number;
}

export interface RestaurantDetailsApiResponse {
  restaurant: RestaurantApiResponse;
  dishes: {
    name: string;
    price: number;
  }[];
  labels: {
    ambience: RestaurantLabel;
    delivery: RestaurantLabel;
    food: RestaurantLabel;
    price: RestaurantLabel;
    service: RestaurantLabel;
  };
  platforms: string[] | null;
  rating_platforms: number[] | null;
  reviews: RestaurantReview[];
}
