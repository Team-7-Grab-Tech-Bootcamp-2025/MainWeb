package model

// Restaurant represents the structure of a restaurant entity
// @Description This struct is used to represent a restaurant in the system
type Restaurant struct {
	// Unique identifier of the restaurant
	ID          string     `json:"id"`
	// Name of the restaurant
	Name        string  `json:"name"`
	// Latitude and longitude coordinates of the restaurant
	Latitude    float64 `json:"latitude"`
	// Longitude of the restaurant
	Longitude   float64 `json:"longitude"`
	// Address of the restaurant
	Address     string  `json:"address"`
	// Overall rating of the restaurant
	Rating      float64 `json:"rating"`
	// Number of reviews for the restaurant
	ReviewCount int     `json:"review_count"`
	// City where the restaurant is located
	CityID      string  `json:"city_id"`
	// District where the restaurant is located
	DistrictID  string  `json:"district_id"`
	// Food type name of the restaurant
	FoodType    string  `json:"food_type_name"`
	// Distance from user's location in kilometers
	Distance    float64 `json:"distance"`
}

type RestaurantDetail struct{
	// Information about the restaurant
	// This includes the restaurant's ID, name, address, etc.
	Restaurant Restaurant `json:"restaurant"`
	// Ratings for different aspects of the restaurant
	// Ambience, delivery, food, price, and service ratings
	Labels LabelsRating `json:"labels"`
	// List of platforms where the restaurant is available
	Platforms []string `json:"platforms"`
	// Ratings for the restaurant on different platforms
	// The length of this array should match the length of the Platforms array
	RatingPlatforms []float64 `json:"rating_platforms"`
}

type LabelRating struct {
	Rating float64 `json:"rating"`
	Count  int     `json:"count"`
}

type LabelsRating struct {
	Ambience LabelRating `json:"ambience"`
	Delivery LabelRating `json:"delivery"`
	Food     LabelRating `json:"food"`
	Price    LabelRating `json:"price"`
	Service  LabelRating `json:"service"`
}
