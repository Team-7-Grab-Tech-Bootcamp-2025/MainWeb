CREATE DATABASE IF NOT EXISTS angi_db;
USE angi_db;

-- Platform table
CREATE TABLE Platform (
    platform_id INT AUTO_INCREMENT PRIMARY KEY,
    platform_name VARCHAR(100) NOT NULL
);

-- Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    platform_id INT,
    FOREIGN KEY (platform_id) REFERENCES Platform(platform_id)
);

-- Restaurant Info table
CREATE TABLE Restaurant_info (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    address TEXT,
    restaurant_rating DECIMAL(3, 2),
    review_count INT DEFAULT 0,
    city VARCHAR(255),
    district VARCHAR(255)
);

-- Dishes table
CREATE TABLE Dishes (
    dish_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    restaurant_id INT,
    category_id INT,
    category_name VARCHAR(100),
    price DECIMAL(10, 2),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant_info(restaurant_id)
);

-- Reviews table
CREATE TABLE Reviews (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    user_id INT,
    rating DECIMAL(2, 1),
    feedback TEXT,
    review_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant_info(restaurant_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Feedback Labels table
CREATE TABLE Feedback_labels (
    feedback_label_id INT AUTO_INCREMENT PRIMARY KEY,
    feedback_label_name VARCHAR(100),
    feedback_label_score DECIMAL(3, 2),
    rating_id INT,
    FOREIGN KEY (rating_id) REFERENCES Reviews(rating_id)
);

-- Temp table
CREATE TABLE Temp (
    UniqueID INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    platform_id INT,
    restaurant_rating DECIMAL(3, 2),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant_info(restaurant_id),
    FOREIGN KEY (platform_id) REFERENCES Platform(platform_id)
);
