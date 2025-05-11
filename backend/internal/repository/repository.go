package repository

import (
	"database/sql"
	"errors"
	"math"
	"skeleton-internship-backend/internal/model"
	"sort"
	"time"

	"github.com/rs/zerolog/log"
)

type Repository interface {
	FindRestaurantByID(id string, lat float64, lng float64) (*model.Restaurant, error)
	FindAllFoodTypes() ([]string, error)
	FindDishesByRestaurantID(id string) ([]model.Dish, error)
	FindFoodTypesByRestaurantID(id string) ([]string, error)
	CalculateLabelsRating(id string) (float64, int, float64, int, float64, int, float64, int, float64, int, error)
	FindPlatformsAndRatingsByRestaurantID(id string) ([]string, []float64, error)
	FindNearbyRestaurants(lat, lng float64, limit int) ([]model.Restaurant, error)
	FindReviewsByRestaurantIDAndLabel(id string, label string, page int, isCount bool) ([]model.Review, int, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

// Haversine function to calculate distance between two points on the Earth
func haversine(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371 // Radius of the Earth in kilometers

	lat1Rad := lat1 * math.Pi / 180
	lat2Rad := lat2 * math.Pi / 180
	deltaLat := (lat2 - lat1) * math.Pi / 180
	deltaLon := (lon2 - lon1) * math.Pi / 180

	a := math.Sin(deltaLat/2)*math.Sin(deltaLat/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(deltaLon/2)*math.Sin(deltaLon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	return R * c
}

func (r *repository) FindRestaurantByID(id string, lat float64, lng float64) (*model.Restaurant, error) {
	query := "SELECT restaurant_id, restaurant_name, latitude, longitude, address, restaurant_rating, review_count, city_id, district_id, Food_type.food_type_name FROM Restaurant JOIN Food_type ON Restaurant.food_type_id = Food_type.food_type_id WHERE restaurant_id = ?"
	row := r.db.QueryRow(query, id)

	log.Info().Msgf("Executing query: %s with id: %s", query, id)

	var restaurant model.Restaurant
	if err := row.Scan(&restaurant.ID, &restaurant.Name, &restaurant.Latitude, &restaurant.Longitude, &restaurant.Address, &restaurant.Rating, &restaurant.ReviewCount, &restaurant.CityID, &restaurant.DistrictID, &restaurant.FoodType); err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("not found")
		}
		log.Error().Err(err).Msg("Error scanning restaurant data")
		return nil, err
	}

	if lat != 0 && lng != 0 {
		// Calculate distance using Haversine formula
		restaurant.Distance = haversine(lat, lng, restaurant.Latitude, restaurant.Longitude)
	} else {
		restaurant.Distance = 0
	}

	return &restaurant, nil
}
func (r *repository) FindAllFoodTypes() ([]string, error) {
	query := "SELECT DISTINCT food_type_name FROM Food_type"
	rows, err := r.db.Query(query)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find all food types")
		return nil, err
	}
	defer rows.Close()

	var foodTypes []string
	for rows.Next() {
		var foodType string
		if err := rows.Scan(&foodType); err != nil {
			log.Error().Err(err).Msg("Error scanning food type data")
			return nil, err
		}
		foodTypes = append(foodTypes, foodType)
	}

	return foodTypes, nil
}

func (r *repository) FindDishesByRestaurantID(id string) ([]model.Dish, error) {
	query := "SELECT item_name, price FROM Dish WHERE restaurant_id = ?"
	rows, err := r.db.Query(query, id)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find dishes by restaurant ID")
		return nil, err
	}
	defer rows.Close()

	var dishes []model.Dish
	for rows.Next() {
		var dish model.Dish
		if err := rows.Scan(&dish.Name, &dish.Price); err != nil {
			log.Error().Err(err).Msg("Error scanning dish data")
			return nil, err
		}
		dishes = append(dishes, dish)
	}

	return dishes, nil
}

func (r *repository) FindFoodTypesByRestaurantID(id string) ([]string, error) {
	query := "SELECT food_type_name FROM Food_type WHERE restaurant_id = ?"
	rows, err := r.db.Query(query, id)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find food types by restaurant ID")
		return nil, err
	}
	defer rows.Close()

	var foodTypes []string
	for rows.Next() {
		var foodType string
		if err := rows.Scan(&foodType); err != nil {
			log.Error().Err(err).Msg("Error scanning food type data")
			return nil, err
		}
		foodTypes = append(foodTypes, foodType)
	}

	return foodTypes, nil
}

func (r *repository) CalculateLabelsRating(id string) (float64, int, float64, int, float64, int, float64, int, float64, int, error) {
	query := `SELECT label, AVG(rating_label), COUNT(rating_label) 
	FROM Review JOIN Feedback_label ON Review.rating_id = Feedback_label.rating_id 
	WHERE restaurant_id = ? GROUP BY label`
	rows, err := r.db.Query(query, id)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to calculate labels rating")
		return 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, err
	}
	defer rows.Close()

	// Default values
	var ambienceRating, deliveryRating, foodRating, priceRating, serviceRating float64
	var ambienceCount, deliveryCount, foodCount, priceCount, serviceCount int

	for rows.Next() {
		var label string
		var rating float64
		var count int
		if err := rows.Scan(&label, &rating, &count); err != nil {
			log.Error().Err(err).Msg("Error scanning label rating data")
			return 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, err
		}

		switch label {
		case "ambience":
			ambienceRating = rating
			ambienceCount = count
		case "delivery":
			deliveryRating = rating
			deliveryCount = count
		case "food":
			foodRating = rating
			foodCount = count
		case "price":
			priceRating = rating
			priceCount = count
		case "service":
			serviceRating = rating
			serviceCount = count
		}
	}

	return ambienceRating, ambienceCount, deliveryRating, deliveryCount, foodRating, foodCount, priceRating, priceCount, serviceRating, serviceCount, nil
}

func (r *repository) FindPlatformsAndRatingsByRestaurantID(id string) ([]string, []float64, error) {
	query := `SELECT Platform.platform_name, Temp.restaurant_rating 
	FROM Temp JOIN Platform ON Temp.platform_id = Platform.platform_id 
	WHERE Temp.restaurant_id = ?`
	rows, err := r.db.Query(query, id)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find platforms and ratings by restaurant ID")
		return nil, nil, err
	}
	defer rows.Close()

	var platforms []string
	var ratings []float64
	for rows.Next() {
		var platform string
		var rating float64
		if err := rows.Scan(&platform, &rating); err != nil {
			log.Error().Err(err).Msg("Error scanning platform and rating data")
			return nil, nil, err
		}
		platforms = append(platforms, platform)
		ratings = append(ratings, rating)
	}

	return platforms, ratings, nil
}

func (r *repository) FindNearbyRestaurants(lat, lng float64, limit int) ([]model.Restaurant, error) {
	var query string
	var args []interface{}

	// If lat/lng are provided, include distance calculation in the query
	if lat != 0 && lng != 0 {
		// Using Haversine formula directly in SQL to calculate distance
		query = `
		SELECT 
			restaurant_id, 
			restaurant_name, 
			latitude, 
			longitude, 
			address, 
			restaurant_rating, 
			review_count, 
			city_id, 
			district_id, 
			Food_type.food_type_name,
			(6371 * ACOS(
				COS(RADIANS(?)) * 
				COS(RADIANS(latitude)) * 
				COS(RADIANS(longitude) - RADIANS(?)) + 
				SIN(RADIANS(?)) * 
				SIN(RADIANS(latitude))
			)) AS distance
		FROM 
			Restaurant 
			JOIN Food_type ON Restaurant.food_type_id = Food_type.food_type_id
		ORDER BY distance ASC
		LIMIT ?`

		args = append(args, lat, lng, lat, limit)
	} else {
		// Skip distance calculation when coordinates aren't provided
		query = `
		SELECT 
			restaurant_id, 
			restaurant_name, 
			latitude, 
			longitude, 
			address, 
			restaurant_rating, 
			review_count, 
			city_id, 
			district_id, 
			Food_type.food_type_name,
			0 AS distance
		FROM 
			Restaurant 
			JOIN Food_type ON Restaurant.food_type_id = Food_type.food_type_id
		ORDER BY restaurant_rating DESC
		LIMIT ?`

		args = append(args, limit)
	}

	log.Info().Msgf("Finding restaurants with lat: %f, lng: %f, limit: %d", lat, lng, limit)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find nearby restaurants")
		return nil, err
	}
	defer rows.Close()

	var restaurants []model.Restaurant

	// Scan results from database
	for rows.Next() {
		var restaurant model.Restaurant
		if err := rows.Scan(
			&restaurant.ID,
			&restaurant.Name,
			&restaurant.Latitude,
			&restaurant.Longitude,
			&restaurant.Address,
			&restaurant.Rating,
			&restaurant.ReviewCount,
			&restaurant.CityID,
			&restaurant.DistrictID,
			&restaurant.FoodType,
			&restaurant.Distance,
		); err != nil {
			log.Error().Err(err).Msg("Error scanning restaurant data")
			return nil, err
		}

		restaurants = append(restaurants, restaurant)
	}

	if lat != 0 || lng != 0 {
		sort.SliceStable(restaurants, func(i, j int) bool {
			return restaurants[i].Rating > restaurants[j].Rating
		})
	}

	return restaurants, nil
}

func (r *repository) FindReviewsByRestaurantIDAndLabel(id string, label string, page int, isCount bool) ([]model.Review, int, error) {
	log.Info().Msgf("Finding reviews for restaurant ID: %s with label: %s on page: %d, isCount: %v", id, label, page, isCount)

	// Calculate offset based on page number (24 reviews per page)
	offset := (page - 1) * 24
	limit := 24

	// Query to get reviews with pagination
	query := `
		SELECT 
			r.rating_id,
			u.user_name,
			r.rating,
			r.feedback,
			r.review_time,
			fl.label,
			fl.rating_label
		FROM 
			Review r
		JOIN 
			User u ON r.user_id = u.user_id
		JOIN 
			Feedback_label fl ON r.rating_id = fl.rating_id
		WHERE 
			r.restaurant_id = ? 
			AND fl.label = ?
		ORDER BY 
			r.review_time DESC
		LIMIT ? OFFSET ?
	`

	rows, err := r.db.Query(query, id, label, limit, offset)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find reviews")
		return nil, 0, err
	}
	defer rows.Close()

	var reviews []model.Review

	for rows.Next() {
		var review model.Review
		var reviewTime sql.NullTime

		if err := rows.Scan(
			&review.RatingID,
			&review.UserName,
			&review.Rating,
			&review.Feedback,
			&reviewTime,
			&review.Label,
			&review.RatingLabel,
		); err != nil {
			log.Error().Err(err).Msg("Error scanning review data")
			return nil, 0, err
		}

		// Format the time as ISO string if not null
		if reviewTime.Valid {
			review.ReviewTime = reviewTime.Time.Format(time.RFC3339)
		}

		reviews = append(reviews, review)
	}

	var totalReviews int

	// Only execute count query if isCount is true
	if isCount {
		// Query to get total count
		countQuery := `
			SELECT 
				COUNT(*)
			FROM 
				Review r
			JOIN 
				Feedback_label fl ON r.rating_id = fl.rating_id
			WHERE 
				r.restaurant_id = ? 
				AND fl.label = ?
		`

		err = r.db.QueryRow(countQuery, id, label).Scan(&totalReviews)
		if err != nil {
			log.Error().Err(err).Msg("Error executing query to count reviews")
			return nil, 0, err
		}
	}

	return reviews, totalReviews, nil
}
