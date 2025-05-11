export interface Restaurant {
  id: string;
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

export interface RestaurantLabel {
  rating: number;
  count: number;
}

export interface RestaurantDetails {
  restaurant: Restaurant;
  labels: {
    ambience: RestaurantLabel;
    delivery: RestaurantLabel;
    food: RestaurantLabel;
    price: RestaurantLabel;
    service: RestaurantLabel;
  };
  platforms: string[] | null;
  ratingPlatforms: number[] | null;
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
  foodtype?: string;
  limit?: number;
}

export interface RestaurantApiResponse {
  id: string;
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
  labels: {
    ambience: RestaurantLabel;
    delivery: RestaurantLabel;
    food: RestaurantLabel;
    price: RestaurantLabel;
    service: RestaurantLabel;
  };
  platforms: string[] | null;
  rating_platforms: number[] | null;
}

export type RestaurantReviewLabel =
  | "ambience"
  | "delivery"
  | "food"
  | "price"
  | "service";

export interface RestaurantReview {
  feedback: string;
  label: string;
  rating: number;
  ratingId: string;
  ratingLabel: number;
  reviewTime: string;
  username: string;
}

export interface RestaurantReviewResponse {
  feedback: string;
  label: string;
  rating: number;
  rating_id: string;
  rating_label: number;
  review_time: string;
  username: string;
}

export interface RestaurantReviews {
  reviews: RestaurantReview[];
  totalReviews: number;
}

export interface RestaurantReviewsResponse {
  reviews: RestaurantReviewResponse[];
  total_reviews: number;
}

export interface RestaurantReviewsParams {
  id: string;
  label: RestaurantReviewLabel;
  page: number;
  count?: number;
}

export interface MenuItem {
  name: string;
  price: number;
}
