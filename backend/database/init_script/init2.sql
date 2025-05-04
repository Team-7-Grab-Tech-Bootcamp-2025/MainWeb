USE angi_db;

-- Insert Platforms
INSERT INTO Platform (platform_name) VALUES ('Foody'), ('Befood');

-- Insert Users
INSERT INTO Users (user_name, platform_id) VALUES
('Alice', 1),
('Bob', 2),
('Charlie', 1);

-- Insert Restaurants
INSERT INTO Restaurant_info (restaurant_name, latitude, longitude, address, restaurant_rating, review_count, city, district) VALUES
('Pizza House', 10.762622, 106.660172, '123 Pizza St.', 4.5, 10, 'Ho Chi Minh City', 'District 1'),
('Noodle World', 10.776889, 106.700806, '456 Noodle Ave.', 4.2, 8, 'Ho Chi Minh City', 'District 3');

-- Insert Dishes
INSERT INTO Dishes (item_name, restaurant_id, category_id, category_name, price) VALUES
('Margherita Pizza', 1, 101, 'Pizza', 79.000),
('Pho Bo', 2, 201, 'Vietnamese Noodles', 45.000);

-- Insert Reviews
INSERT INTO Reviews (restaurant_id, user_id, rating, feedback) VALUES
(1, 1, 4.5, 'Delicious and fresh!'),
(2, 2, 4.0, 'Tasty but a bit salty');

-- Insert Feedback Labels
INSERT INTO Feedback_labels (feedback_label_name, feedback_label_score, rating_id) VALUES
('Fast Service', 4.5, 1),
('Good Portion', 4.0, 2);

-- Insert Temp
INSERT INTO Temp (restaurant_id, platform_id, restaurant_rating) VALUES
(1, 1, 4.5),
(2, 2, 4.2);
