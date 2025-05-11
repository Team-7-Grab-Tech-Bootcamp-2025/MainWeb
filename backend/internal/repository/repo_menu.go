package repository

import (
	"database/sql"
	"errors"
	"skeleton-internship-backend/internal/model"

	"github.com/rs/zerolog/log"
)

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
			if err == sql.ErrNoRows {
				return nil, errors.New("not found")
			}
			log.Error().Err(err).Msg("Error scanning dish data")
			return nil, err
		}
		dishes = append(dishes, dish)
	}

	return dishes, nil
}
