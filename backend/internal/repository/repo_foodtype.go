package repository

import (
	"github.com/rs/zerolog/log"
)

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