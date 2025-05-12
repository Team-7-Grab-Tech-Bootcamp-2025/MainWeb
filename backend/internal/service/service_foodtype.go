package service

import (
	"github.com/rs/zerolog/log"
)

func (s *service) GetAllFoodTypes() ([]string, error) {
	foodTypes, err := s.repo.FindAllFoodTypes()
	if err != nil {
		log.Error().Err(err).Msg("Failed to get all food types (service)")
		return nil, err
	}
	return foodTypes, nil
}
