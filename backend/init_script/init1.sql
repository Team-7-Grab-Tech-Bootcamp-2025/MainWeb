CREATE DATABASE IF NOT EXISTS angi_db;
USE angi_db;
SET GLOBAL max_allowed_packet = 67108864;

-- Platform table
CREATE TABLE Platform (
    platform_id INT AUTO_INCREMENT PRIMARY KEY,
    platform_name VARCHAR(100) NOT NULL UNIQUE
);

-- User table
CREATE TABLE User (
    user_id VARCHAR(100) PRIMARY KEY,
    user_name VARCHAR(555),
    platform_id INT,
    FOREIGN KEY (platform_id) REFERENCES Platform(platform_id)
);

-- District table
CREATE TABLE District (
    district_id INT PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL UNIQUE
);

-- City table
CREATE TABLE City (
    city_id INT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL UNIQUE
);

-- Food_type table
CREATE TABLE Food_type (
    food_type_id INT AUTO_INCREMENT PRIMARY KEY,
    food_type_name VARCHAR(100) UNIQUE
);

-- Restaurant Info table
CREATE TABLE Restaurant (
    restaurant_id VARCHAR(100) PRIMARY KEY,
    restaurant_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    address TEXT,
    restaurant_rating DECIMAL(3, 2),
    review_count INT DEFAULT 0,
    city_id INT,
    district_id INT,
    food_type_id INT,
    FOREIGN KEY (city_id) REFERENCES City(city_id),
    FOREIGN KEY (district_id) REFERENCES District(district_id),
    FOREIGN KEY (food_type_id) REFERENCES Food_type(food_type_id)
);


-- Dish table
CREATE TABLE Dish (
    dish_id VARCHAR(100) PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(100),
    category_id INT,
    category_name VARCHAR(555),
    price DECIMAL(10, 2)
);

-- Review table
CREATE TABLE Review (
    rating_id VARCHAR(100) PRIMARY KEY,
    restaurant_id VARCHAR(100),
    user_id VARCHAR(100),
    rating DECIMAL(2, 1),
    feedback TEXT,
    review_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Feedback Label table
CREATE TABLE Feedback_label (
    feedback_label_id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100),
    rating_label DECIMAL(3, 2),
    rating_id VARCHAR(100),
    FOREIGN KEY (rating_id) REFERENCES Review(rating_id)
);

-- Temp table
CREATE TABLE Temp (
    UniqueID INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id VARCHAR(100),
    platform_id INT,
    restaurant_rating DECIMAL(3, 2),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id),
    FOREIGN KEY (platform_id) REFERENCES Platform(platform_id)
);