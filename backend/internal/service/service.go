package service

import (
	"skeleton-internship-backend/internal/model"
	"skeleton-internship-backend/internal/repository"

	"github.com/rs/zerolog/log"
)

type Service interface {
	GetRestaurantByID(id string, lat float64, lng float64) (*model.Restaurant, error)
	GetAllFoodTypes() ([]string, error)
	GetDishesByRestaurantID(id string) ([]model.Dish, error)
	GetRestaurantDetail(id string, lat float64, lng float64) (*model.RestaurantDetail, error)
	GetRestaurantsByFilter(lat, lng float64, foodType string, cityID string, districtIDs []string, page int, limit int, isCount bool) ([]model.Restaurant, int, error)
	GetNearbyRestaurants(lat, lng float64, limit int) ([]model.Restaurant, error)
	GetRestaurantReviewsByLabel(id string, label string, page int, isCount bool, textOnly bool) (*model.ReviewResponse, error)
	GetRestaurantsByAutocomplete(searchWords []string, limit int) ([]model.Restaurant, error)
	RecalculateRestaurantsRating() error
	ExportRestaurantsToCSV() error
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

func (s *service) GetRestaurantsByFilter(lat, lng float64, foodType string, cityID string, districtIDs []string, page int, limit int, isCount bool) ([]model.Restaurant, int, error) {
	log.Info().Msgf("Finding restaurants with filters - lat: %f, lng: %f, foodType: %s, cityID: %s, districtIDs: %v, page: %d, limit: %d, isCount: %v",
		lat, lng, foodType, cityID, districtIDs, page, limit, isCount)

	restaurants, totalCount, err := s.repo.FindRestaurantsByFilter(lat, lng, foodType, cityID, districtIDs, page, limit, isCount)
	if err != nil {
		log.Error().Err(err).Msg("Failed to find restaurants by filter (service)")
		return nil, 0, err
	}

	return restaurants, totalCount, nil
}

func (s *service) GetRestaurantReviewsByLabel(id string, label string, page int, isCount bool, textOnly bool) (*model.ReviewResponse, error) {
	log.Info().Msgf("Fetching reviews for restaurant ID: %s with label: %s on page: %d, isCount: %v, textOnly: %v", id, label, page, isCount, textOnly)

	// Check if restaurant exists
	_, err := s.GetRestaurantByID(id, 0, 0)
	if err != nil {
		return nil, err
	}
	// Get reviews from repository
	reviews, totalReviews, err := s.repo.FindReviewsByRestaurantIDAndLabel(id, label, page, isCount, textOnly)
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
