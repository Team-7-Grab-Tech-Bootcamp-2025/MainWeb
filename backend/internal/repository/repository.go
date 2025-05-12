package repository

import (
	"database/sql"
	"errors"
	"math"
	"skeleton-internship-backend/internal/model"
	"sort"
	"strings"

	"skeleton-internship-backend/internal/constant"

	"github.com/rs/zerolog/log"
)

type Repository interface {
	FindRestaurantByID(id string, lat float64, lng float64) (*model.Restaurant, error)
	FindAllFoodTypes() ([]string, error)
	FindDishesByRestaurantID(id string) ([]model.Dish, error)
	CalculateLabelsRating(id string) (float64, int, float64, int, float64, int, float64, int, float64, int, error)
	CountReviewsByRestaurantID(id string) (int, error)
	FindPlatformsAndRatingsByRestaurantID(id string) ([]string, []float64, error)
	FindRestaurantsByFilter(lat, lng float64, foodType string, cityID string, districtID string, page int, limit int, isCount bool) ([]model.Restaurant, int, error)
	FindNearbyRestaurants(lat, lng float64, limit int) ([]model.Restaurant, error)
	FindReviewsByRestaurantIDAndLabel(id string, label string, page int, isCount bool, textOnly bool) ([]model.Review, int, error)
	FindRestaurantsByName(searchWords []string, limit int) ([]model.Restaurant, error)
	FindAllRestaurants() ([]string, []float64, []int, error)
	UpdateRestaurantRating(id string, rating float64, reviewCount int) error
	RecalculateCountReviews() error
	RecalculateAverageRating() error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

// Haversine function to calculate distance (km)
func haversine(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371 // Radius of the Earth (km)

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
	var restaurant model.Restaurant
	var address sql.NullString
	if err := row.Scan(&restaurant.ID, &restaurant.Name, &restaurant.Latitude, &restaurant.Longitude, &address, &restaurant.Rating, &restaurant.ReviewCount, &restaurant.CityID, &restaurant.DistrictID, &restaurant.FoodType); err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("not found")
		}
		log.Error().Err(err).Msg("Error scanning restaurant data")
		return nil, err
	}
	if address.Valid {
		restaurant.Address = address.String
	} else {
		restaurant.Address = "" // Empty string for NULL address
	}

	if lat != 0 && lng != 0 {
		restaurant.Distance = haversine(lat, lng, restaurant.Latitude, restaurant.Longitude)
	} else {
		restaurant.Distance = 0
	}

	return &restaurant, nil
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

func (r *repository) FindRestaurantsByFilter(lat, lng float64, foodType string, cityID string, districtID string, page int, limit int, isCount bool) ([]model.Restaurant, int, error) {
	var queryBuilder strings.Builder
	var args []interface{}
	var whereConditions []string
	var offset int

	queryBuilder.WriteString(`
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
	`)

	// lat and lng handle
	if lat != 0 && lng != 0 {
		queryBuilder.WriteString(`
		(6371 * ACOS(
			COS(RADIANS(?)) * 
			COS(RADIANS(latitude)) * 
			COS(RADIANS(longitude) - RADIANS(?)) + 
			SIN(RADIANS(?)) * 
			SIN(RADIANS(latitude))
		)) AS distance
		`)
		args = append(args, lat, lng, lat)
	} else {
		queryBuilder.WriteString(`0 AS distance`)
	}

	queryBuilder.WriteString(`
	FROM 
		Restaurant 
		JOIN Food_type ON Restaurant.food_type_id = Food_type.food_type_id
	`)

	// Add WHERE clause conditions
	// Filter by food type
	if foodType != "" {
		whereConditions = append(whereConditions, `Food_type.food_type_name = ?`)
		args = append(args, foodType)
	}

	// Filter by city
	if cityID != "" {
		whereConditions = append(whereConditions, `city_id = ?`)
		args = append(args, cityID)
	}

	// Filter by district
	if districtID != "" {
		whereConditions = append(whereConditions, `district_id = ?`)
		args = append(args, districtID)
	}

	// Add WHERE clause if we have conditions
	if len(whereConditions) > 0 {
		queryBuilder.WriteString(` WHERE ` + strings.Join(whereConditions, " AND "))
	}

	// Add ORDER BY clause
	if lat != 0 && lng != 0 {
		queryBuilder.WriteString(` ORDER BY distance ASC`)
	} else {
		queryBuilder.WriteString(` ORDER BY restaurant_rating DESC`)
	}

	// Handle page and limit
	if page > 0 {
		// Use page-based pagination
		offset = (page - 1) * constant.NumberofRestaurantsperPage
		limit = constant.NumberofRestaurantsperPage
		queryBuilder.WriteString(` LIMIT ? OFFSET ?`)
		args = append(args, limit, offset)
	} else if limit > 0 {
		// Use limit-only
		queryBuilder.WriteString(` LIMIT ?`)
		args = append(args, limit)
	}

	query := queryBuilder.String()

	// Log the query for debugging
	log.Info().Msgf("Finding restaurants with filters - lat: %f, lng: %f, foodType: %s, cityID: %s, districtID: %s, page: %d, limit: %d, isCount: %v",
		lat, lng, foodType, cityID, districtID, page, limit, isCount)

	// Execute the query
	rows, err := r.db.Query(query, args...)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find restaurants by filter")
		return nil, 0, err
	}
	defer rows.Close()

	var restaurants []model.Restaurant

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
			return nil, 0, err
		}

		restaurants = append(restaurants, restaurant)
	}

	// Sort by rating (descending)
	sort.SliceStable(restaurants, func(i, j int) bool {
		return restaurants[i].Rating > restaurants[j].Rating
	})

	totalCount := 0
	if isCount {
		var countQueryBuilder strings.Builder
		countQueryBuilder.WriteString(`
			SELECT COUNT(*) 
			FROM Restaurant 
			JOIN Food_type ON Restaurant.food_type_id = Food_type.food_type_id
		`)

		// Reuse WHERE conditions
		if len(whereConditions) > 0 {
			countQueryBuilder.WriteString(` WHERE ` + strings.Join(whereConditions, " AND "))
		}

		// Execute count query
		countArgs := args[:] // Make a copy
		if page > 0 {
			countArgs = args[:len(args)-2] // Remove LIMIT and OFFSET args
		} else if limit > 0 {
			countArgs = args[:len(args)-1] // Remove just LIMIT arg
		}
		if lat != 0 && lng != 0 {
			countArgs = countArgs[3:] // Remove lat, lng, and lat args
		}
		log.Info().Msgf("Executing count query: %s with args: %v", countQueryBuilder.String(), countArgs)

		err = r.db.QueryRow(countQueryBuilder.String(), countArgs...).Scan(&totalCount)
		if err != nil {
			log.Error().Err(err).Msg("Error executing count query")
			return restaurants, 0, err
		}
	}

	return restaurants, totalCount, nil
}

func (r *repository) FindRestaurantsByName(searchWords []string, limit int) ([]model.Restaurant, error) {
	log.Info().Msgf("Searching for restaurants with search words: %v, limit: %d", searchWords, limit)

	var whereConditions []string
	var args []interface{}

	// Create WHERE conditions for each word
	for _, word := range searchWords {
		whereConditions = append(whereConditions, "restaurant_name LIKE ?")
		args = append(args, "%"+word+"%")
	}

	// If no words were provided, return an empty result
	if len(whereConditions) == 0 {
		return []model.Restaurant{}, nil
	}

	query := `
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
	WHERE 
		` + strings.Join(whereConditions, " AND ") + `
	ORDER BY 
		restaurant_rating DESC
	LIMIT ?
	`
	// Add the limit parameter
	args = append(args, limit)
	log.Info().Msgf("Executing query: %s with args: %v", query, args)
	rows, err := r.db.Query(query, args...)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find restaurants by name")
		return nil, err
	}
	defer rows.Close()

	var restaurants []model.Restaurant

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
			log.Error().Err(err).Msg("Error scanning restaurant data for autocomplete")
			return nil, err
		}

		restaurants = append(restaurants, restaurant)
	}

	return restaurants, nil
}

func (r *repository) FindNearbyRestaurants(lat, lng float64, limit int) ([]model.Restaurant, error) {
	restaurants, _, err := r.FindRestaurantsByFilter(lat, lng, "", "", "", 0, limit, false)
	return restaurants, err
}

func (r *repository) FindAllRestaurants() ([]string, []float64, []int, error) {
	log.Info().Msg("Finding all restaurants ID, rating, and review count")
	query := `SELECT restaurant_id, restaurant_rating, review_count FROM Restaurant`

	rows, err := r.db.Query(query)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find all restaurants")
		return nil, nil, nil, err
	}
	defer rows.Close()

	var restaurantIDs []string
	var restaurantRatings []float64
	var reviewCounts []int
	for rows.Next() {
		var id string
		var rating float64
		var count int
		if err := rows.Scan(&id, &rating, &count); err != nil {
			log.Error().Err(err).Msg("Error scanning restaurant data")
			return nil, nil, nil, err
		}
		restaurantIDs = append(restaurantIDs, id)
		restaurantRatings = append(restaurantRatings, rating)
		reviewCounts = append(reviewCounts, count)
	}

	return restaurantIDs, restaurantRatings, reviewCounts, nil
}
