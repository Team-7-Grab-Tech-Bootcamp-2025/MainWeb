package repository

import (
	"database/sql"
	"errors"
	"skeleton-internship-backend/internal/constant"
	"skeleton-internship-backend/internal/model"
	"time"

	"github.com/rs/zerolog/log"
)

func (r *repository) CalculateLabelsRating(id string) (float64, int, float64, int, float64, int, float64, int, float64, int, error) {
	query := `SELECT label, SUM(rating_label), COUNT(*) 
	FROM Review JOIN Feedback_label ON Review.rating_id = Feedback_label.rating_id 
	WHERE restaurant_id = ? GROUP BY label`
	rows, err := r.db.Query(query, id)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to calculate labels rating")
		return 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, err
	}
	defer rows.Close()

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
		case "ambience":
			ambienceRating += rating
			ambienceCount += count
		case "delivery":
			deliveryRating += rating
			deliveryCount += count
		case "food":
			foodRating += rating
			foodCount += count
		case "price":
			priceRating += rating
			priceCount += count
		case "service":
			serviceRating += rating
			serviceCount += count
		case "unknown":
			ambienceRating += rating
			ambienceCount += count
			deliveryRating += rating
			deliveryCount += count
			foodRating += rating
			foodCount += count
			priceRating += rating
			priceCount += count
			serviceRating += rating
			serviceCount += count
		}
	}

	ambienceRating = float64(ambienceRating) / float64(ambienceCount)
	deliveryRating = float64(deliveryRating) / float64(deliveryCount)
	foodRating = float64(foodRating) / float64(foodCount)
	priceRating = float64(priceRating) / float64(priceCount)
	serviceRating = float64(serviceRating) / float64(serviceCount)

	return ambienceRating, ambienceCount, deliveryRating, deliveryCount, foodRating, foodCount, priceRating, priceCount, serviceRating, serviceCount, nil
}

func (r *repository) FindReviewsByRestaurantIDAndLabel(id string, label string, page int, isCount bool) ([]model.Review, int, error) {
	log.Info().Msgf("Finding reviews for restaurant ID: %s with label: %s on page: %d, isCount: %v", id, label, page, isCount)

	// Calculate offset based on page number (constant reviews per page)
	offset := (page - 1) * constant.NumberofRestaurantsperPage
	limit := constant.NumberofRestaurantsperPage

	// Query to get reviews with pagination
	query := `
		SELECT 
			r.rating_id,
			u.user_name,
			r.rating,
			r.feedback,
			r.review_time,
			fl.label,
			fl.rating_label
		FROM 
			Review r
		JOIN 
			User u ON r.user_id = u.user_id
		JOIN 
			Feedback_label fl ON r.rating_id = fl.rating_id
		WHERE 
			r.restaurant_id = ? 
			AND (fl.label = ? OR fl.label = 'unknown')
		ORDER BY 
			r.review_time DESC
		LIMIT ? OFFSET ?`

	rows, err := r.db.Query(query, id, label, limit, offset)
	if err != nil {
		log.Error().Err(err).Msg("Error executing query to find reviews")
		return nil, 0, err
	}
	defer rows.Close()

	var reviews []model.Review

	for rows.Next() {
		var review model.Review
		var reviewTime sql.NullTime

		if err := rows.Scan(
			&review.RatingID,
			&review.UserName,
			&review.Rating,
			&review.Feedback,
			&reviewTime,
			&review.Label,
			&review.RatingLabel,
		); err != nil {
			log.Error().Err(err).Msg("Error scanning review data")
			return nil, 0, err
		}

		// Format the time as ISO string if not null
		if reviewTime.Valid {
			review.ReviewTime = reviewTime.Time.Format(time.RFC3339)
		}

		reviews = append(reviews, review)
	}

	var totalReviews int

	if isCount {
		countQuery := `
			SELECT 
				COUNT(*)
			FROM 
				Review r
			JOIN 
				Feedback_label fl ON r.rating_id = fl.rating_id
			WHERE 
				r.restaurant_id = ? 
				AND (fl.label = ? OR fl.label = 'unknown')`

		err = r.db.QueryRow(countQuery, id, label).Scan(&totalReviews)
		if err != nil {
			log.Error().Err(err).Msg("Error executing query to count reviews")
			return nil, 0, err
		}
	}

	return reviews, totalReviews, nil
}

func (r *repository) CountReviewsByRestaurantID(id string) (int, error) {
	query := `SELECT COUNT(*) FROM Review WHERE restaurant_id = ?`
	row := r.db.QueryRow(query, id)
	var count int
	if err := row.Scan(&count); err != nil {
		if err == sql.ErrNoRows {
			return 0, errors.New("not found")
		}
		log.Error().Err(err).Msg("Error scanning review count")
		return 0, err
	}
	return count, nil
}
