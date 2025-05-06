package model

// Restaurant represents the structure of a restaurant entity
// @Description This struct is used to represent a restaurant in the system
type Restaurant struct {
	// Unique identifier of the restaurant
	ID          int     `json:"id"`
	// Name of the restaurant
	Name        string  `json:"name,omitempty"`
	// Latitude and longitude coordinates of the restaurant
	Latitude    float64 `json:"latitude,omitempty"`
	// Longitude of the restaurant
	Longitude   float64 `json:"longitude,omitempty"`
	// Address of the restaurant
	Address     string  `json:"address"`
	// Overall rating of the restaurant
	Rating      float64 `json:"rating,omitempty"`
	// Number of reviews for the restaurant
	ReviewCount int     `json:"review_count"`
	// City where the restaurant is located
	CityID      string  `json:"city_id"`
	// District where the restaurant is located
	DistrictID  string  `json:"district_id"`
}


type RestaurantDetail struct{
	Restaurant Restaurant `json:"restaurant"`
	// List of food types available at the restaurant
	FoodTypes []string `json:"food_types"`
	// List of dishes available at the restaurant
	Dishes []Dish `json:"dishes"`
}