package service

import (
	"os"
	"skeleton-internship-backend/internal/model"
	"skeleton-internship-backend/internal/repository"
	"strconv"
	"sync"

	"github.com/rs/zerolog/log"
)

type Service interface {
	GetRestaurantByID(id string, lat float64, lng float64) (*model.Restaurant, error)
	GetAllFoodTypes() ([]string, error)
	GetDishesByRestaurantID(id string) ([]model.Dish, error)
	GetRestaurantDetail(id string, lat float64, lng float64) (*model.RestaurantDetail, error)
	GetRestaurantsByFilter(lat, lng float64, foodType string, cityID string, districtID string, page int, limit int, isCount bool) ([]model.Restaurant, int, error)
	GetNearbyRestaurants(lat, lng float64, limit int) ([]model.Restaurant, error)
	GetRestaurantReviewsByLabel(id string, label string, page int, isCount bool) (*model.ReviewResponse, error)
	GetRestaurantsByAutocomplete(searchWords []string, limit int) ([]model.Restaurant, error)
	RecalculateRestaurantsRating() error
}

type service struct {
	repo repository.Repository
}

func NewService(repo repository.Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetRestaurantByID(id string, lat float64, lng float64) (*model.Restaurant, error) {
	restaurant, err := s.repo.FindRestaurantByID(id, lat, lng)
	if err != nil {
		return nil, err
	}
	log.Info().Msgf("Restaurant found: %+v", restaurant)
	return restaurant, nil
}

func (s *service) GetAllFoodTypes() ([]string, error) {
	foodTypes, err := s.repo.FindAllFoodTypes()
	if err != nil {
		log.Error().Err(err).Msg("Failed to get all food types (service)")
		return nil, err
	}
	return foodTypes, nil
}
func (s *service) GetDishesByRestaurantID(id string) ([]model.Dish, error) {
	dishes, err := s.repo.FindDishesByRestaurantID(id)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get dishes by restaurant ID (service)")
		return nil, err
	}
	return dishes, nil
}

func (s *service) GetLabelsRating(id string) (*model.LabelsRating, error) {
	ambienceRating, ambienceCount, deliveryRating, deliveryCount, foodRating, foodCount, priceRating, priceCount, serviceRating, serviceCount, err := s.repo.CalculateLabelsRating(id)
	if err != nil {
		log.Error().Err(err).Msg("Failed to calculate labels rating (service)")
		return nil, err
	}

	labelsRating := &model.LabelsRating{
		Ambience: model.LabelRating{
			Rating: ambienceRating,
			Count:  ambienceCount,
		},
		Delivery: model.LabelRating{
			Rating: deliveryRating,
			Count:  deliveryCount,
		},
		Food: model.LabelRating{
			Rating: foodRating,
			Count:  foodCount,
		},
		Price: model.LabelRating{
			Rating: priceRating,
			Count:  priceCount,
		},
		Service: model.LabelRating{
			Rating: serviceRating,
			Count:  serviceCount,
		},
	}

	return labelsRating, nil
}

func (s *service) GetRestaurantDetail(id string, lat float64, lng float64) (*model.RestaurantDetail, error) {
	restaurant, err := s.GetRestaurantByID(id, lat, lng)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get restaurant by ID (service)")
		return nil, err
	}
	log.Info().Msgf("Restaurant found (service): %+v", restaurant)
	labelsRating, err := s.GetLabelsRating(id)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get labels rating by restaurant ID (service)")
		return nil, err
	}

	platforms, ratings, err := s.repo.FindPlatformsAndRatingsByRestaurantID(id)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get platforms and ratings by restaurant ID (service)")
		return nil, err
	}

	restaurantDetail := &model.RestaurantDetail{
		Restaurant:      *restaurant,
		Labels:          *labelsRating,
		Platforms:       platforms,
		RatingPlatforms: ratings,
	}

	return restaurantDetail, nil
}

func (s *service) GetNearbyRestaurants(lat, lng float64, limit int) ([]model.Restaurant, error) {
	log.Info().Msgf("Finding nearby restaurants at coordinates (%f, %f) with limit %d", lat, lng, limit)
	restaurants, err := s.repo.FindNearbyRestaurants(lat, lng, limit)
	if err != nil {
		log.Error().Err(err).Msg("Failed to find nearby restaurants (service)")
		return nil, err
	}
	return restaurants, nil
}

func (s *service) GetRestaurantsByFilter(lat, lng float64, foodType string, cityID string, districtID string, page int, limit int, isCount bool) ([]model.Restaurant, int, error) {
	log.Info().Msgf("Finding restaurants with filters - lat: %f, lng: %f, foodType: %s, cityID: %s, districtID: %s, page: %d, limit: %d, isCount: %v",
		lat, lng, foodType, cityID, districtID, page, limit, isCount)

	restaurants, totalCount, err := s.repo.FindRestaurantsByFilter(lat, lng, foodType, cityID, districtID, page, limit, isCount)
	if err != nil {
		log.Error().Err(err).Msg("Failed to find restaurants by filter (service)")
		return nil, 0, err
	}

	return restaurants, totalCount, nil
}

func (s *service) GetRestaurantReviewsByLabel(id string, label string, page int, isCount bool) (*model.ReviewResponse, error) {
	log.Info().Msgf("Fetching reviews for restaurant ID: %s with label: %s on page: %d, isCount: %v", id, label, page, isCount)

	// Check if restaurant exists
	_, err := s.GetRestaurantByID(id, 0, 0)
	if err != nil {
		return nil, err
	}
	// Get reviews from repository
	reviews, totalReviews, err := s.repo.FindReviewsByRestaurantIDAndLabel(id, label, page, isCount)
	if err != nil {
		log.Error().Err(err).Msg("Failed to fetch reviews by restaurant ID and label (service)")
		return nil, err
	}

	return &model.ReviewResponse{
		Reviews:      reviews,
		TotalReviews: totalReviews,
	}, nil
}

// GetRestaurantsByAutocomplete handles restaurant name autocomplete functionality
func (s *service) GetRestaurantsByAutocomplete(searchWords []string, limit int) ([]model.Restaurant, error) {
	log.Info().Msgf("Autocompleting restaurants with search words: %v, limit: %d", searchWords, limit)

	// Get restaurants from repository using the provided words
	restaurants, err := s.repo.FindRestaurantsByName(searchWords, limit)
	if err != nil {
		log.Error().Err(err).Msg("Failed to fetch restaurants for autocomplete (service)")
		return nil, err
	}

	return restaurants, nil
}

func (s *service) RecalculateRestaurantsRating() error {
	log.Info().Msg("Recalculating restaurants rating (service) with parallel processing")

	// Get all restaurants
	restaurants, err := s.repo.FindAllRestaurants()
	if err != nil {
		log.Error().Err(err).Msg("Failed to find all restaurants (service)")
		return err
	}

	// Define a struct to hold restaurant rating data for CSV
	type restaurantRatingData struct {
		ID          string
		Rating      float64
		ReviewCount int
	}

	// Create a channel to collect results
	resultChan := make(chan restaurantRatingData, len(restaurants))

	// Create a wait group to wait for all goroutines to finish
	var wg sync.WaitGroup

	// Set a limit on the number of concurrent goroutines
	// Adjust this based on your system capabilities and database connection pool
	workerLimit := 10
	semaphore := make(chan struct{}, workerLimit)

	// Process each restaurant in parallel
	for _, id := range restaurants {
		wg.Add(1)
		// Make a copy of id for the goroutine to avoid race conditions
		restaurantID := id

		// Acquire a slot in the semaphore
		semaphore <- struct{}{}

		// Process restaurant in a goroutine
		go func() {
			defer wg.Done()
			defer func() { <-semaphore }() // Release the semaphore slot when done

			// Get label ratings for the restaurant
			ambienceRating, ambienceCount, deliveryRating, deliveryCount, foodRating, foodCount, priceRating, priceCount, serviceRating, serviceCount, err := s.repo.CalculateLabelsRating(restaurantID)
			if err != nil {
				log.Error().Err(err).Msgf("Failed to calculate labels rating for restaurant %s", restaurantID)
				return
			}
			totalCount, err := s.repo.CountReviewsByRestaurantID(restaurantID)
			if err != nil {
				log.Error().Err(err).Msgf("Failed to count reviews for restaurant %s", restaurantID)
				return
			}

			var totalRating float64 = 0
			var validLabelCount int = 0

			// Sum ratings and counts from labels with reviews
			if ambienceCount > 0 {
				totalRating += ambienceRating
				validLabelCount++
			}
			if deliveryCount > 0 {
				totalRating += deliveryRating
				validLabelCount++
			}
			if foodCount > 0 {
				totalRating += foodRating
				validLabelCount++
			}
			if priceCount > 0 {
				totalRating += priceRating
				validLabelCount++
			}
			if serviceCount > 0 {
				totalRating += serviceRating
				validLabelCount++
			}

			var overallRating float64 = 0
			if validLabelCount > 0 {
				overallRating = totalRating / float64(validLabelCount)
			}

			// Update restaurant rating and review count
			if err := s.repo.UpdateRestaurantRating(restaurantID, overallRating, totalCount); err != nil {
				log.Error().Err(err).Msgf("Failed to update rating for restaurant %s", restaurantID)
				return
			}

			log.Info().Msgf("Updated restaurant %s with rating %.2f and review count %d", restaurantID, overallRating, totalCount)

			// Send the result to the channel
			resultChan <- restaurantRatingData{
				ID:          restaurantID,
				Rating:      overallRating,
				ReviewCount: totalCount,
			}
		}()
	}

	// Close the result channel when all goroutines are done
	go func() {
		wg.Wait()
		close(resultChan)
	}()

	// CSV header
	csvData := []byte("restaurant_id,restaurant_rating,review_count\n")
	// Collect results from the channel
	for result := range resultChan {
		// Format as CSV row
		row := []byte(result.ID + "," +
			strconv.FormatFloat(result.Rating, 'f', 2, 64) + "," +
			strconv.Itoa(result.ReviewCount) + "\n")

		// Append to CSV data
		csvData = append(csvData, row...)
	}

	// Write CSV data to file in /tmp directory (accessible in Docker)
	filename := "/tmp/restaurant_ratings.csv"
	err = os.WriteFile(filename, csvData, 0644)
	if err != nil {
		log.Error().Err(err).Msgf("Failed to write CSV file to %s", filename)
		return err
	}

	log.Info().Msgf("Successfully exported restaurant ratings to %s", filename)
	return nil
}
