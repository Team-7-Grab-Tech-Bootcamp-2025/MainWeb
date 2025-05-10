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
	// GetFoodTypesByRestaurantID(id string) ([]string, error)
	GetLabelsRating(id string) (*model.LabelsRating, error)
	GetRestaurantDetail(id string, lat float64, lng float64) (*model.RestaurantDetail, error)
	GetNearbyRestaurants(lat, lng float64, limit int) ([]model.Restaurant, error)
	GetRestaurantReviewsByLabel(id int, label string, page int) (*model.ReviewResponse, error)
}

type service struct {
	repo repository.Repository
}

func NewService(repo repository.Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetRestaurantByID(id string, lat float64, lng float64) (*model.Restaurant, error) {
	log.Info().Msgf("Fetching restaurant with ID: %s", id)
	restaurant, err := s.repo.FindRestaurantByID(id, lat, lng)
	log.Info().Msgf("Restaurant found: %+v", restaurant)
	if err != nil {
		log.Error().Err(err).Msg("Failed to find restaurant by ID")
		return nil, err
	}
	return restaurant, nil
}

func (s *service) GetAllFoodTypes() ([]string, error) {
	foodTypes, err := s.repo.FindAllFoodTypes()
	if err != nil {
		log.Error().Err(err).Msg("Failed to get all food types")
		return nil, err
	}
	return foodTypes, nil
}
func (s *service) GetDishesByRestaurantID(id string) ([]model.Dish, error) {
	dishes, err := s.repo.FindDishesByRestaurantID(id)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get dishes by restaurant ID")
		return nil, err
	}
	return dishes, nil
}

// func (s *service) GetFoodTypesByRestaurantID(id string) ([]string, error) {
// 	foodTypes, err := s.repo.FindFoodTypesByRestaurantID(id)
// 	if err != nil {
// 		log.Error().Err(err).Msg("Failed to get food types by restaurant ID")
// 		return nil, err
// 	}
// 	return foodTypes, nil
// }

func (s *service) GetLabelsRating(id string) (*model.LabelsRating, error) {
	ambienceRating, ambienceCount, deliveryRating, deliveryCount, foodRating, foodCount, priceRating, priceCount, serviceRating, serviceCount, err := s.repo.CalculateLabelsRating(id)
	if err != nil {
		log.Error().Err(err).Msg("Failed to calculate labels rating")
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
		return nil, err
	}
	labelsRating, err := s.GetLabelsRating(id)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get labels rating")
		return nil, err
	}

	platforms, ratings, err := s.repo.FindPlatformsAndRatingsByRestaurantID(id)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get platforms and ratings")
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
		log.Error().Err(err).Msg("Failed to find nearby restaurants")
		return nil, err
	}
	return restaurants, nil
}

func (s *service) GetRestaurantReviewsByLabel(id int, label string, page int) (*model.ReviewResponse, error) {
	log.Info().Msgf("Fetching reviews for restaurant ID: %d with label: %s on page: %d", id, label, page)

	// Check if restaurant exists
	_, err := s.GetRestaurantByID(id, 0, 0)
	if err != nil {
		return nil, err
	}

	// Get reviews from repository
	reviews, totalReviews, err := s.repo.FindReviewsByRestaurantIDAndLabel(id, label, page)
	if err != nil {
		log.Error().Err(err).Msg("Failed to fetch reviews by restaurant ID and label")
		return nil, err
	}

	return &model.ReviewResponse{
		Reviews:      reviews,
		TotalReviews: totalReviews,
	}, nil
}
