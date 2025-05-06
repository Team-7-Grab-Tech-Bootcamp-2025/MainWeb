package model

// Restaurant represents the structure of a restaurant entity
type Restaurant struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Address     string  `json:"address"`
	Rating      float64 `json:"rating"`
	ReviewCount int     `json:"review_count"`
	City        string  `json:"city"`
	District    string  `json:"district"`
}