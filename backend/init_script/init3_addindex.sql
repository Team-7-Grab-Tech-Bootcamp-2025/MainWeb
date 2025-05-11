USE angi_db;

-- Index for Restaurant spatial queries
-- This will improve FindNearbyRestaurants queries that calculate distance
CREATE INDEX idx_restaurant_location ON Restaurant(latitude, longitude);

-- Index for Restaurant rating queries
-- This will speed up queries that sort by restaurant_rating
CREATE INDEX idx_restaurant_rating ON Restaurant(restaurant_rating DESC);

-- Index for finding all restaurants by food_type_id
-- This benefits restaurant search by food type
CREATE INDEX idx_restaurant_food_type ON Restaurant(food_type_id);

-- Optimize for filtering restaurants by city and district
-- Helps when filtering restaurants by city or district
CREATE INDEX idx_restaurant_location_admin ON Restaurant(city_id, district_id);

-- Index for text search by restaurant name
-- Improves FindRestaurantsByName queries
CREATE INDEX idx_restaurant_name ON Restaurant(restaurant_name);

-- Index for finding dishes by restaurant_id
-- Speeds up FindDishesByRestaurantID
CREATE INDEX idx_dish_restaurant ON Dish(restaurant_id);

-- Index for Review queries by restaurant_id
-- Improves review lookup by restaurant
CREATE INDEX idx_review_restaurant ON Review(restaurant_id);

-- Composite index for Review time sorting by restaurant
-- Optimizes FindReviewsByRestaurantIDAndLabel with DESC time sorting
CREATE INDEX idx_review_restaurant_time ON Review(restaurant_id, review_time DESC);

-- Index for user reviews
-- Helps when looking up a user's reviews
CREATE INDEX idx_review_user ON Review(user_id);

-- Index for feedback labels by rating_id
-- Speeds up CalculateLabelsRating
CREATE INDEX idx_feedback_label_rating ON Feedback_label(rating_id);

-- Composite index for label ratings
-- Optimizes aggregations by label
CREATE INDEX idx_feedback_label_info ON Feedback_label(rating_id, label);

-- Composite index to optimize FindReviewsByRestaurantIDAndLabel joins
-- Indexing rating_id, label combination for faster joins with Review table
CREATE INDEX idx_feedback_label_combined ON Feedback_label(rating_id, label, rating_label);

-- Index for feedback label value filtering
-- Speeds up queries filtering by specific label values
CREATE INDEX idx_feedback_label_label ON Feedback_label(label);

-- Index for rating_label calculations
-- Improves performance of SUM and AVG operations on rating_label field
CREATE INDEX idx_feedback_label_rating_value ON Feedback_label(rating_label);

-- Index for Review table by rating_id
-- Optimizes joins between Review and Feedback_label tables
CREATE INDEX idx_review_rating_id ON Review(rating_id);

-- Index for Temp table lookups by restaurant
-- Improves FindPlatformsAndRatingsByRestaurantID
CREATE INDEX idx_temp_restaurant_platform ON Temp(restaurant_id, platform_id);