package repository

import (
	"github.com/rs/zerolog/log"
)

func (r *repository) RecalculateCountReviews() error {
	query := `UPDATE Restaurant r
              LEFT JOIN (
                  SELECT restaurant_id, COUNT(*) AS review_total
                  FROM Review
                  GROUP BY restaurant_id
              ) rev ON r.restaurant_id = rev.restaurant_id
              SET r.review_count = IFNULL(rev.review_total, 0);`
	_, err := r.db.Exec(query)
	if err != nil {
		log.Error().Err(err).Msg("Error recalculating review count")
		return err
	}
	return nil
}

func (r *repository) RecalculateAverageRating() error {
	query :=
		`WITH label_stats AS (
  SELECT
    r.restaurant_id,
    fl.label,
    SUM(fl.rating_label) AS sum_label,
    COUNT(*)             AS cnt_label
  FROM Feedback_label fl
  JOIN Review r ON fl.rating_id = r.rating_id
  WHERE fl.label <> 'unknown'
  GROUP BY r.restaurant_id, fl.label
),

unknown_stats AS (
  SELECT
    r.restaurant_id,
    SUM(fl.rating_label) AS sum_unknown,
    COUNT(*) AS cnt_unknown
  FROM Feedback_label fl
  JOIN Review r ON fl.rating_id = r.rating_id
  WHERE fl.label = 'unknown'
  GROUP BY r.restaurant_id
),

label_avgs AS (
  SELECT
    l.restaurant_id,
    l.label,
    CASE
      WHEN (l.cnt_label + COALESCE(u.cnt_unknown, 0)) > 0 THEN
        (l.sum_label + COALESCE(u.sum_unknown, 0))
        / (l.cnt_label + COALESCE(u.cnt_unknown, 0))
      ELSE NULL
    END AS label_avg
  FROM label_stats l
  LEFT JOIN unknown_stats u
    ON l.restaurant_id = u.restaurant_id
),
final_rating AS (
  SELECT
    restaurant_id,
    ROUND(AVG(label_avg), 2) AS restaurant_avg_rating
  FROM label_avgs
  WHERE label_avg IS NOT NULL
  GROUP BY restaurant_id
)
UPDATE Restaurant r
JOIN final_rating fr ON r.restaurant_id = fr.restaurant_id
SET r.restaurant_rating = fr.restaurant_avg_rating;`

	_, err := r.db.Exec(query)
	if err != nil {
		log.Error().Err(err).Msg("Error recalculating rating labels")
		return err
	}
	return nil
}

func (r *repository) UpdateRestaurantRating(id string, rating float64, reviewCount int) error {

	query := `UPDATE Restaurant SET restaurant_rating = ?, review_count = ? WHERE restaurant_id = ?`
	_, err := r.db.Exec(query, rating, reviewCount, id)
	if err != nil {
		log.Error().Err(err).Msgf("Error updating restaurant %s rating", id)
		return err
	}

	return nil
}