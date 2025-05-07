package repository

import (
	"database/sql"
	"errors"
	"math"
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
	FindAllFoodTypes() ([]string, error)
	FindDishesByRestaurantID(id int) ([]model.Dish, error)
	FindFoodTypesByRestaurantID(id int) ([]string, error)
	CalculateDistance(lat1, lon1, lat2, lon2 float64) float64
	CalculateLabelsRating(id int) (float64, int, float64, int, float64, int, float64, int, float64, int, error)
	FindPlatformsAndRatingsByRestaurantID(id int) ([]string, []float64, error)
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
	query := "SELECT restaurant_id, restaurant_name, latitude, longitude, address, restaurant_rating, review_count, city_id, district_id, Food_type.food_type_name FROM Restaurant JOIN Food_type ON Restaurant.food_type_id = Food_type.food_type_id WHERE restaurant_id = ?"
	row := r.db.QueryRow(query, id)

	log.Info().Msgf("Executing query: %s with id: %d", query, id)

	var restaurant model.Restaurant
	if err := row.Scan(&restaurant.ID, &restaurant.Name, &restaurant.Latitude, &restaurant.Longitude, &restaurant.Address, &restaurant.Rating, &restaurant.ReviewCount, &restaurant.CityID, &restaurant.DistrictID, &restaurant.FoodType); err != nil {
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

func (r *repository) FindDishesByRestaurantID(id int) ([]model.Dish, error) {
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
			log.Error().Err(err).Msg("Error scanning dish data")
			return nil, err
		}
		dishes = append(dishes, dish)
	}

	return dishes, nil
}

func (r *repository) FindFoodTypesByRestaurantID(id int) ([]string, error) {
	query := "SELECT food_type_name FROM Food_type WHERE restaurant_id = ?"
	rows, err := r.db.Query(query, id)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find food types by restaurant ID")
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

func (r *repository) CalculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	// Haversine formula to calculate the distance between two points on the Earth
	const R = 6371 // Radius of the Earth in kilometers
	dLat := (lat2 - lat1) * (3.141592653589793 / 180)
	dLon := (lon2 - lon1) * (3.141592653589793 / 180)
	a := (math.Sin(dLat/2) * math.Sin(dLat/2)) + (math.Cos(lat1*(math.Pi/180)) * math.Cos(lat2*(math.Pi/180)) * math.Sin(dLon/2) * math.Sin(dLon/2))
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return R * c // Distance in kilometers
}

func (r *repository) CalculateLabelsRating(id int) (float64, int, float64, int, float64, int, float64, int, float64, int, error) {
	query := `SELECT label, AVG(rating_label), COUNT(rating_label) 
	FROM Review JOIN Feedback_label ON Review.rating_id = Feedback_label.rating_id 
	WHERE restaurant_id = ? GROUP BY label`
	rows, err := r.db.Query(query, id)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to calculate labels rating")
		return 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, err
	}
	defer rows.Close()

	// Default values
	var ambienceRating, deliveryRating, foodRating, priceRating, serviceRating float64
	var ambienceCount, deliveryCount, foodCount, priceCount, serviceCount int

	for rows.Next() {
		var label string
		var rating float64
		var count int
		if err := rows.Scan(&label, &rating, &count); err != nil {
			log.Error().Err(err).Msg("Error scanning label rating data")
			return 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, err
		}

		switch label {
		case "Ambience":
			ambienceRating = rating
			ambienceCount = count
		case "Delivery":
			deliveryRating = rating
			deliveryCount = count
		case "Food":
			foodRating = rating
			foodCount = count
		case "Price":
			priceRating = rating
			priceCount = count
		case "Service":
			serviceRating = rating
			serviceCount = count
		}
	}

	return ambienceRating, ambienceCount, deliveryRating, deliveryCount, foodRating, foodCount, priceRating, priceCount, serviceRating, serviceCount, nil
}

func (r *repository) FindPlatformsAndRatingsByRestaurantID(id int) ([]string, []float64, error) {
	query := `SELECT Platform.platform_name, Temp.restaurant_rating 
	FROM Temp JOIN Platform ON Temp.platform_id = Platform.platform_id 
	WHERE Temp.restaurant_id = ?`
	rows, err := r.db.Query(query, id)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find platforms and ratings by restaurant ID")
		return nil, nil, err
	}
	defer rows.Close()

	var platforms []string
	var ratings []float64
	for rows.Next() {
		var platform string
		var rating float64
		if err := rows.Scan(&platform, &rating); err != nil {
			log.Error().Err(err).Msg("Error scanning platform and rating data")
			return nil, nil, err
		}
		platforms = append(platforms, platform)
		ratings = append(ratings, rating)
	}

	return platforms, ratings, nil
}
