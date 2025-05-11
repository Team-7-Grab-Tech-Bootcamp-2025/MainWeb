package controller

import (
	"net/http"
	"strconv"
	"strings"

	"skeleton-internship-backend/internal/model"
	"skeleton-internship-backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

type Controller struct {
	service service.Service
}

func NewController(service service.Service) *Controller {
	return &Controller{
		service: service,
	}
}

func (c *Controller) RegisterRoutes(router *gin.Engine) {
	log.Info().Msg("Registering routes")
	router.GET("/health", c.HealthCheck)
	v1 := router.Group("/api/v1")
	{
		restaurants := v1.Group("/restaurants")
		{
			restaurants.GET("/:id", c.GetRestaurantDetailByID)
			restaurants.GET("/search", c.AutocompleteRestaurants)
			restaurants.GET("/:id/menu", c.GetRestaurantMenuByID)
			restaurants.GET("/:id/reviews", c.GetRestaurantReviewsByLabel)
		}
		v1.GET("/restaurants", c.GetNearbyRestaurants)
		v1.GET("/foodtypes", c.GetAllFoodTypes)
	}
}

// HealthCheck godoc
// @Summary Show the status of server.
// @Description get the status of server.
// @Tags health
// @Accept */*
// @Produce json
// @Success 200 {object} model.Response
// @Router /health [get]
func (x *Controller) HealthCheck(ctx *gin.Context) {
	log.Info().Msg("Health check")
	ctx.JSON(http.StatusOK, model.NewResponse("OK", nil))
}

// GetRestaurantDetailByID godoc
// @Summary Get a restaurant
// @Description get restaurant by ID
// @Tags restaurants
// @Accept json
// @Produce json
// @Param id path string true "Restaurant ID"
// @Param lat query number false "Latitude" (optional)
// @Param lng query number false "Longitude" (optional)
// @Success 200 {object} model.Response{data=model.RestaurantDetail}
// @Failure 400 {object} model.Response
// @Failure 404 {object} model.Response
// @Router /api/v1/restaurants/{id} [get]
func (c *Controller) GetRestaurantDetailByID(ctx *gin.Context) {

	log.Info().Msg("Fetching restaurant by ID")

	var lat, lng float64
	var err error

	// Get query parameters
	latStr := ctx.Query("lat")
	lngStr := ctx.Query("lng")

	// Parse lat/lng if provided, otherwise use 0 (which will sort by rating only)
	if latStr != "" {
		lat, err = strconv.ParseFloat(latStr, 64)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, model.NewResponse("Invalid latitude format", nil))
			return
		}
	}

	if lngStr != "" {
		lng, err = strconv.ParseFloat(lngStr, 64)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, model.NewResponse("Invalid longitude format", nil))
			return
		}
	}

	// No need to convert ID to integer anymore, just use the string directly
	id := ctx.Param("id")

	restaurantDetail, err := c.service.GetRestaurantDetail(id, lat, lng)
	if err != nil {
		if err.Error() == "not found" {
			ctx.JSON(http.StatusNotFound, model.NewResponse("Restaurant not found", nil))
		} else {
			ctx.JSON(http.StatusInternalServerError, model.NewResponse("Failed to fetch restaurant details", nil))
		}
		return
	}

	ctx.JSON(http.StatusOK, model.NewResponse("Restaurant fetched successfully", restaurantDetail))
}

// GetAllFoodTypes godoc
// @Summary Get all food types
// @Description get all food types
// @Tags foodtypes
// @Accept json
// @Produce json
// @Success 200 {object} model.Response{data=[]string}
// @Failure 500 {object} model.Response
// @Router /api/v1/foodtypes [get]
func (c *Controller) GetAllFoodTypes(ctx *gin.Context) {
	log.Info().Msg("Fetching all food types")
	foodTypes, err := c.service.GetAllFoodTypes()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.NewResponse("Failed to fetch food types", nil))
		return
	}

	ctx.JSON(http.StatusOK, model.NewResponse("Food types fetched successfully", foodTypes))
}

// GetNearbyRestaurants godoc
// @Summary Get nearby restaurants
// @Description get top rated restaurants near specified coordinates
// @Tags restaurants
// @Accept json
// @Produce json
// @Param lat query number false "Latitude" (optional)
// @Param lng query number false "Longitude" (optional)
// @Param limit query int false "Limit results" default(30)
// @Success 200 {object} model.Response{data=[]model.Restaurant}
// @Failure 400 {object} model.Response
// @Failure 500 {object} model.Response
// @Router /api/v1/restaurants [get]
func (c *Controller) GetNearbyRestaurants(ctx *gin.Context) {
	log.Info().Msg("Fetching nearby restaurants")

	var lat, lng float64
	var err error

	// Get query parameters
	latStr := ctx.Query("lat")
	lngStr := ctx.Query("lng")
	limitStr := ctx.DefaultQuery("limit", "30")

	// Parse lat/lng if provided, otherwise use 0 (which will sort by rating only)
	if latStr != "" {
		lat, err = strconv.ParseFloat(latStr, 64)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, model.NewResponse("Invalid latitude format", nil))
			return
		}
	}

	if lngStr != "" {
		lng, err = strconv.ParseFloat(lngStr, 64)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, model.NewResponse("Invalid longitude format", nil))
			return
		}
	}

	// Parse limit
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 30 // Default limit
	}

	// Get restaurants, either by distance or just by rating if no coordinates
	restaurants, err := c.service.GetNearbyRestaurants(lat, lng, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.NewResponse("Failed to fetch restaurants", nil))
		return
	}

	// If no lat/lng provided, we're returning top rated restaurants
	var message string
	if latStr == "" || lngStr == "" {
		message = "Top rated restaurants fetched successfully"
	} else {
		message = "Nearby restaurants fetched successfully"
	}

	ctx.JSON(http.StatusOK, model.NewResponse(message, restaurants))
}

// GetRestaurantReviewsByLabel godoc
// @Summary Get restaurant reviews by label
// @Description get restaurant reviews by ID and label
// @Tags restaurants
// @Accept json
// @Produce json
// @Param id path int true "Restaurant ID"
// @Param label query string true "Label type (ambience, delivery, food, price, service)"
// @Param page query int true "Page number" default(1)
// @Param count query boolean false "Whether to count total reviews" default(true)
// @Success 200 {object} model.Response{data=model.ReviewResponse}
// @Failure 400 {object} model.Response
// @Failure 404 {object} model.Response
// @Router /api/v1/restaurants/{id}/reviews [get]
func (c *Controller) GetRestaurantReviewsByLabel(ctx *gin.Context) {
	log.Info().Msg("Fetching restaurant reviews by label")

	id := ctx.Param("id")
	label := ctx.Query("label")
	if label == "" {
		ctx.JSON(http.StatusBadRequest, model.NewResponse("Label parameter is required", nil))
		return
	}

	// Validate label values
	validLabels := map[string]bool{
		"Ambience": true,
		"Delivery": true,
		"Food":     true,
		"Price":    true,
		"Service":  true,
	}

	if !validLabels[label] {
		ctx.JSON(http.StatusBadRequest, model.NewResponse("Invalid label. Must be one of: Ambience, Delivery, Food, Price, Service", nil))
		return
	}
	// Extract and validate page parameter
	pageStr := ctx.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		ctx.JSON(http.StatusBadRequest, model.NewResponse("Invalid page number", nil))
		return
	}

	// Check if count parameter is provided
	countStr := ctx.DefaultQuery("count", "true")
	isCount := countStr == "true"

	// Get reviews from service
	reviewResponse, err := c.service.GetRestaurantReviewsByLabel(id, label, page, isCount)
	if err != nil {
		if err.Error() == "not found" {
			ctx.JSON(http.StatusNotFound, model.NewResponse("Restaurant not found", nil))
		} else {
			ctx.JSON(http.StatusInternalServerError, model.NewResponse("Failed to fetch reviews", nil))
		}
		return
	}

	ctx.JSON(http.StatusOK, model.NewResponse("Reviews fetched successfully", reviewResponse))
}

// GetRestaurantMenuByID godoc
// @Summary Get restaurant menu
// @Description get restaurant menu by ID
// @Tags restaurants
// @Accept json
// @Produce json
// @Param id path string true "Restaurant ID"
// @Success 200 {object} model.Response{data=[]model.Dish}
// @Failure 404 {object} model.Response
// @Failure 500 {object} model.Response
// @Router /api/v1/restaurants/{id}/menu [get]
func (c *Controller) GetRestaurantMenuByID(ctx *gin.Context) {
	log.Info().Msg("Fetching restaurant menu by ID")

	id := ctx.Param("id")

	// Fetch the menu using the service layer
	menu, err := c.service.GetDishesByRestaurantID(id)
	if err != nil {
		if err.Error() == "not found" {
			ctx.JSON(http.StatusNotFound, model.NewResponse("Restaurant not found", nil))
		} else {
			ctx.JSON(http.StatusInternalServerError, model.NewResponse("Failed to fetch restaurant menu", nil))
		}
		return
	}
	ctx.JSON(http.StatusOK, model.NewResponse("Restaurant menu fetched successfully", menu))
}

// AutocompleteRestaurants godoc
// @Summary Get autocomplete suggestions for restaurants
// @Description get restaurant name suggestions based on search query
// @Tags restaurants
// @Accept json
// @Produce json
// @Param query query string true "Search query"
// @Param limit query int false "Limit results" default(10)
// @Success 200 {object} model.Response{data=[]model.Restaurant}
// @Failure 500 {object} model.Response
// @Router /api/v1/restaurants/search [get]
func (c *Controller) AutocompleteRestaurants(ctx *gin.Context) {
	log.Info().Msg("Fetching restaurant autocomplete suggestions")

	// Get query parameters
	query := ctx.Query("query")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, model.NewResponse("Search query is required", nil))
		return
	}

	limitStr := ctx.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10 // Default limit
	}

	// Parse the query parameter into words, handling URL encoding (+ characters)
	query = strings.Replace(query, "+", " ", -1)
	searchWords := strings.Fields(query)

	// Get autocomplete results from service with the parsed words
	restaurants, err := c.service.GetRestaurantsByAutocomplete(searchWords, limit)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get restaurant autocomplete suggestions")
		ctx.JSON(http.StatusInternalServerError, model.NewResponse("Failed to get restaurant suggestions", nil))
		return
	}

	ctx.JSON(http.StatusOK, model.NewResponse("Restaurant suggestions fetched successfully", restaurants))
}
