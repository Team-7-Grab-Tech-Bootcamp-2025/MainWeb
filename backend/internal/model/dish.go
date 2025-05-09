package model

// Dish represents the structure of a dish entity
// @Description This struct is used to represent a dish in the system
type Dish struct {
	// Name of the dish
	Name  string  `json:"name"`
	// Price of the dish
	Price float64 `json:"price"`
}