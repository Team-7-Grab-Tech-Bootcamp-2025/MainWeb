package service

import (
	"skeleton-internship-backend/internal/model"

	"github.com/rs/zerolog/log"
)

func (s *service) GetDishesByRestaurantID(id string) ([]model.Dish, error) {
	dishes, err := s.repo.FindDishesByRestaurantID(id)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get dishes by restaurant ID (service)")
		return nil, err
	}
	return dishes, nil
}