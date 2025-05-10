package service

import (
	"errors"
	"skeleton-internship-backend/internal/dto"
	"skeleton-internship-backend/internal/model"
	"skeleton-internship-backend/internal/repository"

	"github.com/rs/zerolog/log"
)

type Service interface {
	CreateTodo(input *dto.TodoCreate) (*model.Todo, error)
	GetAllTodos() ([]model.Todo, error)
	GetTodoByID(id uint) (*model.Todo, error)
	UpdateTodo(id uint, input *dto.TodoCreate) (*model.Todo, error)
	DeleteTodo(id uint) error
	GetRestaurantByID(id string, lat float64, lng float64) (*model.Restaurant, error)
	GetAllFoodTypes() ([]string, error)
	GetDishesByRestaurantID(id string) ([]model.Dish, error)
	// GetFoodTypesByRestaurantID(id string) ([]string, error)
	GetLabelsRating(id string) (*model.LabelsRating, error)
	GetRestaurantDetail(id string, lat float64, lng float64) (*model.RestaurantDetail, error)
	GetNearbyRestaurants(lat, lng float64, limit int) ([]model.Restaurant, error)
}

type service struct {
	repo repository.Repository
}

func NewService(repo repository.Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateTodo(input *dto.TodoCreate) (*model.Todo, error) {
	todo := &model.Todo{
		Title:       input.Title,
		Description: input.Description,
		Status:      input.Status,
	}

	if todo.Status == "" {
		todo.Status = "pending"
	}

	err := s.repo.Create(todo)
	if err != nil {
		return nil, err
	}

	return todo, nil
}

func (s *service) GetAllTodos() ([]model.Todo, error) {
	return s.repo.FindAll()
}

func (s *service) GetTodoByID(id uint) (*model.Todo, error) {
	todo, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return todo, nil
}

func (s *service) UpdateTodo(id uint, input *dto.TodoCreate) (*model.Todo, error) {
	todo, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	todo.Title = input.Title
	todo.Description = input.Description
	if input.Status != "" {
		todo.Status = input.Status
	}

	err = s.repo.Update(todo)
	if err != nil {
		return nil, err
	}

	return todo, nil
}

func (s *service) DeleteTodo(id uint) error {
	todo, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if todo == nil {
		return errors.New("todo not found")
	}

	return s.repo.Delete(id)
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

	dishes, err := s.GetDishesByRestaurantID(id)
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
		Dishes:          dishes,
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
