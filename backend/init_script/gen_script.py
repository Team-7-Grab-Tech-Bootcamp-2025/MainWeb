import random
from faker import Faker

fake = Faker()
random.seed(42)

# Initialize file content
lines = []
lines.append("CREATE DATABASE IF NOT EXISTS angi_db;")
lines.append("USE angi_db;\n")

# Insert Platforms
lines.append("-- Platforms")
platforms = ["Foody", "BeFood"]
for i, p in enumerate(platforms, start=1):
    lines.append(f"INSERT INTO Platform (platform_id, platform_name) VALUES ({i}, '{p}');")
lines.append("")

# Insert Cities
lines.append("-- Cities")
cities = {1: "Ha Noi", 2: "TP. HCM"}
for cid, cname in cities.items():
    lines.append(f"INSERT INTO City (city_id, city_name) VALUES ({cid}, '{cname}');")
lines.append("")

# Insert Districts
lines.append("-- Districts")
districts_hn = [
    "Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Long Biên", "Cầu Giấy", "Đống Đa",
    "Hai Bà Trưng", "Hoàng Mai", "Thanh Xuân"
]
districts_hcm = [
    "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6",
    "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12",
    "Bình Thạnh", "Phú Nhuận", "Tân Bình", "Tân Phú", "Gò Vấp", "Bình Tân"
]
did = 1
for d in districts_hn:
    lines.append(f"INSERT INTO District (district_id, district_name) VALUES ({did}, '{d}');")
    did += 1
for d in districts_hcm:
    lines.append(f"INSERT INTO District (district_id, district_name) VALUES ({did}, '{d}');")
    did += 1
lines.append("")

# Insert Users
lines.append("-- Users")
for uid in range(1, 51):
    name = fake.user_name().replace("'", "")
    platform_id = random.choice([1, 2])
    lines.append(f"INSERT INTO User (user_id, user_name, platform_id) VALUES ({uid}, '{name}', {platform_id});")
lines.append("")

# Insert Restaurants
lines.append("-- Restaurants")
restaurant_ids = list(range(1, 101))
for rid in restaurant_ids:
    name = fake.company().replace("'", "")
    lat = round(random.uniform(10.75, 21.0), 6)
    lon = round(random.uniform(106.5, 105.5), 6)
    addr = fake.address().replace("\n", ", ").replace("'", "")
    rating = round(random.uniform(2.5, 5.0), 2)
    rev_count = random.randint(0, 500)
    city_id = random.choice([1, 2])
    district_offset = 0 if city_id == 1 else len(districts_hn)
    district_id = random.randint(1 + district_offset, len(districts_hn) + len(districts_hcm) if city_id == 2 else len(districts_hn))
    lines.append(f"INSERT INTO Restaurant (restaurant_id, restaurant_name, latitude, longitude, address, restaurant_rating, review_count, city_id, district_id) VALUES ({rid}, '{name}', {lat}, {lon}, '{addr}', {rating}, {rev_count}, {city_id}, {district_id});")
lines.append("")

# Insert Dishes
lines.append("-- Dishes")
dish_id = 1
for rid in restaurant_ids:
    for _ in range(random.randint(4, 7)):
        dish_name = fake.word().capitalize()
        price = round(random.uniform(20.0, 200.0), 2)
        category_name = random.choice(["Appetizer", "Main Course", "Dessert", "Drink"])
        lines.append(f"INSERT INTO Dish (dish_id, item_name, restaurant_id, category_name, price) VALUES ({dish_id}, '{dish_name}', {rid}, '{category_name}', {price});")
        dish_id += 1
lines.append("")

# Insert Reviews
lines.append("-- Reviews")
review_id = 1
for _ in range(150):
    rid = random.choice(restaurant_ids)
    uid = random.randint(1, 50)
    rating = round(random.uniform(1.0, 5.0), 1)
    feedback = fake.sentence().replace("'", "")
    review_time = fake.date_time_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d %H:%M:%S')
    lines.append(f"INSERT INTO Review (rating_id, restaurant_id, user_id, rating, feedback, review_time) VALUES ({review_id}, {rid}, {uid}, {rating}, '{feedback}', '{review_time}');")
    review_id += 1
lines.append("")

# Insert Feedback Labels
lines.append("-- Feedback Labels")
labels = ["Food", "Service", "Delivery", "Price", "Ambience"]
label_id = 1
for rid in range(1, review_id):
    for _ in range(random.randint(1, 2)):  # about 300 total
        label = random.choice(labels)
        rating_val = round(random.uniform(1.0, 5.0), 2)
        lines.append(f"INSERT INTO Feedback_label (feedback_label_id, label, rating_label, rating_id) VALUES ({label_id}, '{label}', {rating_val}, {rid});")
        label_id += 1
lines.append("")

# Insert Temp
lines.append("-- Temp")
temp_id = 1
for _ in range(50):
    rid = random.choice(restaurant_ids)
    pid = random.choice([1, 2])
    rating = round(random.uniform(2.5, 5.0), 2)
    lines.append(f"INSERT INTO Temp (UniqueID, restaurant_id, platform_id, restaurant_rating) VALUES ({temp_id}, {rid}, {pid}, {rating});")
    temp_id += 1
lines.append("")

# Insert Food Types
lines.append("-- Food Types")
food_types = set()
while len(food_types) < 20:
    food_types.add(fake.word().capitalize())
food_type_id = 1
for ft in food_types:
    rid = random.choice(restaurant_ids)
    lines.append(f"INSERT INTO Food_type (food_type_id, food_type_name, restaurant_id) VALUES ({food_type_id}, '{ft}', {rid});")
    food_type_id += 1

# Write to file
file_path = "/mnt/data/init.sql"
with open(file_path, "w") as f:
    f.write("\n".join(lines))

file_path
