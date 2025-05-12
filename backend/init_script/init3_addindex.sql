USE angi_db;

-- FindNearbyRestaurants queries that calculate distance
CREATE INDEX idx_restaurant_location ON Restaurant(latitude, longitude);

-- Sort by restaurant_rating
CREATE INDEX idx_restaurant_rating ON Restaurant(restaurant_rating DESC);

-- Restaurant search by food type
CREATE INDEX idx_restaurant_food_type ON Restaurant(food_type_id);

-- Filter restaurants by city or district
CREATE INDEX idx_restaurant_location_admin ON Restaurant(city_id, district_id);

-- Improves FindRestaurantsByName queries
CREATE INDEX idx_restaurant_name ON Restaurant(restaurant_name);

-- Improves FindDishesByRestaurantID
CREATE INDEX idx_dish_restaurant ON Dish(restaurant_id);

-- Improves review lookup by restaurant
CREATE INDEX idx_review_restaurant ON Review(restaurant_id);

-- Improves FindReviewsByRestaurantIDAndLabel with DESC time sorting
CREATE INDEX idx_review_restaurant_time ON Review(restaurant_id, review_time DESC);

CREATE INDEX idx_review_user ON Review(user_id);

-- Improves CalculateLabelsRating
CREATE INDEX idx_feedback_label_rating ON Feedback_label(rating_id);

-- Optimizes aggregations by label
CREATE INDEX idx_feedback_label_info ON Feedback_label(rating_id, label);

-- Indexing rating_id, label combination for faster joins with Review table
CREATE INDEX idx_feedback_label_combined ON Feedback_label(rating_id, label, rating_label);

-- Improves filtering by label
CREATE INDEX idx_feedback_label_label ON Feedback_label(label);

-- Improves SUM and AVG calculations
CREATE INDEX idx_feedback_label_rating_value ON Feedback_label(rating_label);

-- Improves joins between Review and Feedback_label tables
CREATE INDEX idx_review_rating_id ON Review(rating_id);

-- Improves FindPlatformsAndRatingsByRestaurantID
CREATE INDEX idx_temp_restaurant_platform ON Temp(restaurant_id, platform_id);