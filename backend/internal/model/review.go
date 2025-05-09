package model

// Review represents the structure of a review entity
// @Description This struct is used to represent a review in the system
type Review struct {
	RatingID    string  `json:"rating_id"`
	UserName    string  `json:"username"`
	Rating      float64 `json:"rating"`
	Feedback    string  `json:"feedback"`
	ReviewTime  string  `json:"review_time"`
	Label       string  `json:"label"`
	RatingLabel float64 `json:"rating_label"`
}

// ReviewResponse represents a paginated response for reviews
type ReviewResponse struct {
	Reviews      []Review `json:"reviews"`
	TotalReviews int      `json:"total_reviews"`
}
