package service

import (
	"os"
	"strconv"

	"github.com/rs/zerolog/log"
)

func (s *service) RecalculateRestaurantsRating() error {
	log.Info().Msg("Recalculating restaurants rating (service) with parallel processing")
	err := s.repo.RecalculateCountReviews()
	if err != nil {
		log.Error().Err(err).Msg("Failed to recalculate count reviews (service)")
		return err
	}

	err = s.repo.RecalculateAverageRating()
	if err != nil {
		log.Error().Err(err).Msg("Failed to recalculate average rating (service)")
		return err
	}
	log.Info().Msg("Recalculation of restaurant ratings completed successfully (service)")
	return nil
}

func (s *service) ExportRestaurantsToCSV() error {
	log.Info().Msg("Exporting restaurants to CSV (service)")
	restaurantID, ratings, reviewCounts, err := s.repo.FindAllRestaurants()
	if err != nil {
		log.Error().Err(err).Msg("Failed to export restaurants to CSV (service)")
		return err
	}

	csvData := []byte("restaurant_id,restaurant_rating,review_count\n")
	for i := 0; i < len(restaurantID); i++ {
		row := []byte(restaurantID[i] + "," +
			strconv.FormatFloat(ratings[i], 'f', 2, 64) + "," +
			strconv.Itoa(reviewCounts[i]) + "\n")
		csvData = append(csvData, row...)
	}

	// Create a CSV file
	filename := "/tmp/restaurant_ratings.csv"
	err = os.WriteFile(filename, csvData, 0644)
	if err != nil {
		log.Error().Err(err).Msgf("Failed to write CSV file to %s", filename)
		return err
	}

	log.Info().Msgf("Exporting restaurants to CSV completed successfully (service)")
	return nil
}