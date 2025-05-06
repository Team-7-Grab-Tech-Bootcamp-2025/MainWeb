package repository

import (
	"database/sql"
	"errors"
	"skeleton-internship-backend/internal/model"

	"github.com/rs/zerolog/log"
)

type Repository interface {
	Create(todo *model.Todo) error
	FindAll() ([]model.Todo, error)
	FindByID(id uint) (*model.Todo, error)
	Update(todo *model.Todo) error
	Delete(id uint) error
	FindRestaurantByID(id int) (*model.Restaurant, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(todo *model.Todo) error {
	query := "INSERT INTO todos (title, description, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())"
	_, err := r.db.Exec(query, todo.Title, todo.Description, todo.Status)
	return err
}

func (r *repository) FindAll() ([]model.Todo, error) {
	query := "SELECT id, title, description, status, created_at, updated_at FROM todos"
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []model.Todo
	for rows.Next() {
		var todo model.Todo
		if err := rows.Scan(&todo.ID, &todo.Title, &todo.Description, &todo.Status, &todo.CreatedAt, &todo.UpdatedAt); err != nil {
			return nil, err
		}
		todos = append(todos, todo)
	}

	return todos, nil
}

func (r *repository) FindByID(id uint) (*model.Todo, error) {
	query := "SELECT id, title, description, status, created_at, updated_at FROM todos WHERE id = ?"
	row := r.db.QueryRow(query, id)

	var todo model.Todo
	if err := row.Scan(&todo.ID, &todo.Title, &todo.Description, &todo.Status, &todo.CreatedAt, &todo.UpdatedAt); err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("not found")
		}
		return nil, err
	}

	return &todo, nil
}

func (r *repository) Update(todo *model.Todo) error {
	query := "UPDATE todos SET title = ?, description = ?, status = ?, updated_at = NOW() WHERE id = ?"
	_, err := r.db.Exec(query, todo.Title, todo.Description, todo.Status, todo.ID)
	return err
}

func (r *repository) Delete(id uint) error {
	query := "DELETE FROM todos WHERE id = ?"
	_, err := r.db.Exec(query, id)
	return err
}

func (r *repository) FindRestaurantByID(id int) (*model.Restaurant, error) {
	query := "SELECT restaurant_id, restaurant_name, latitude, longitude, address, restaurant_rating, review_count, city, district FROM Restaurant_info WHERE restaurant_id = ?"
	row := r.db.QueryRow(query, id)

	log.Info().Msgf("Executing query: %s with id: %d", query, id)

	var restaurant model.Restaurant
	if err := row.Scan(&restaurant.ID, &restaurant.Name, &restaurant.Latitude, &restaurant.Longitude, &restaurant.Address, &restaurant.Rating, &restaurant.ReviewCount, &restaurant.City, &restaurant.District); err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("not found")
		}
		log.Error().Err(err).Msg("Error scanning restaurant data")
		return nil, err
	}

	return &restaurant, nil
}

func (r *repository) FindRestaurantByID(id int) (*model.Restaurant, error) {
	query := "SELECT restaurant_id, restaurant_name, latitude, longitude, address, restaurant_rating, review_count, city_id, district_id FROM Restaurant WHERE restaurant_id = ?"
	row := r.db.QueryRow(query, id)

	log.Info().Msgf("Executing query: %s with id: %d", query, id)

	var restaurant model.Restaurant
	if err := row.Scan(&restaurant.ID, &restaurant.Name, &restaurant.Latitude, &restaurant.Longitude, &restaurant.Address, &restaurant.Rating, &restaurant.ReviewCount, &restaurant.CityID, &restaurant.DistrictID); err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("not found")
		}
		log.Error().Err(err).Msg("Error scanning restaurant data")
		return nil, err
	}

	return &restaurant, nil
}
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