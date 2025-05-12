package service

import (
	"skeleton-internship-backend/internal/model"

	"github.com/rs/zerolog/log"
)

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