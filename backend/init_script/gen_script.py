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
lines.append("INSERT INTO Platform (platform_id, platform_name) VALUES ")
for i, p in enumerate(platforms, start=1):
    lines.append(f"({i}, '{p}'),")
lines[-1] = lines[-1].rstrip(',\n') + ';'
lines.append("")

# Insert Users
lines.append("-- Users")
lines.append("INSERT INTO User (user_id, user_name, platform_id) VALUES ")
for uid in range(1, 51):
    name = fake.user_name().replace("'", "")
    platform_id = random.choice([1, 2])
    lines.append(f"({uid}, '{name}', {platform_id}),")
lines[-1] = lines[-1].rstrip(',') + ';'
lines.append("")

# Insert Cities
lines.append("-- Cities")
cities = {1: "Ha Noi", 2: "TP. HCM"}
lines.append("INSERT INTO City (city_id, city_name) VALUES ")
for cid, cname in cities.items():
    lines.append(f"({cid}, '{cname}'),")
lines[-1] = lines[-1].rstrip(',') + ';'
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
lines.append("INSERT INTO District (district_id, district_name) VALUES ")
did = 1
for d in districts_hn:
    lines.append(f"({did}, '{d}'),")
    did += 1
for d in districts_hcm:
    lines.append(f"({did}, '{d}'),")
    did += 1
lines[-1] = lines[-1].rstrip(',') + ';'
lines.append("")

# Insert Food Types
lines.append("-- Food Types")
lines.append("INSERT INTO Food_type (food_type_id, food_type_name) VALUES ")
food_types = set()
while len(food_types) < 20:
    food_types.add(fake.word().capitalize())
food_type_id = 1
for ft in food_types:
    lines.append(f"({food_type_id}, '{ft}'),")
    food_type_id += 1
lines[-1] = lines[-1].rstrip(',') + ';'
lines.append("")

# Insert Restaurants
lines.append("-- Restaurants")
lines.append("INSERT INTO Restaurant (restaurant_id, restaurant_name, latitude, longitude, address, restaurant_rating, review_count, city_id, district_id, food_type_id) VALUES ")
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
    food_type_id = random.randint(1, 20)  # Randomly assign a food type from the 20 available
    lines.append(f"({rid}, '{name}', {lat}, {lon}, '{addr}', {rating}, {rev_count}, {city_id}, {district_id}, {food_type_id}),")
lines[-1] = lines[-1].rstrip(',') + ';'
lines.append("")

# Insert Dishes
lines.append("-- Dishes")
lines.append("INSERT INTO Dish (dish_id, item_name, restaurant_id, category_id, category_name, price) VALUES ")
dish_id = 1
for rid in restaurant_ids:
    for _ in range(random.randint(4, 7)):
        dish_name = fake.word().capitalize()
        price = round(random.uniform(20.0, 200.0), 2)
        category_id = random.randint(1, 4) 
        category_name = random.choice(["Appetizer", "Main Course", "Dessert", "Drink"])
        lines.append(f"({dish_id}, '{dish_name}', {rid}, {category_id}, '{category_name}', {price}),")
        dish_id += 1
lines[-1] = lines[-1].rstrip(',') + ';'
lines.append("")

# Insert Reviews
lines.append("-- Reviews")
lines.append("INSERT INTO Review (rating_id, restaurant_id, user_id, rating, feedback, review_time) VALUES ")
review_id = 1
for _ in range(150):
    rid = random.choice(restaurant_ids)
    uid = random.randint(1, 50)
    rating = round(random.uniform(1.0, 5.0), 1)
    feedback = fake.sentence().replace("'", "")
    review_time = fake.date_time_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d %H:%M:%S')
    lines.append(f"({review_id}, {rid}, {uid}, {rating}, '{feedback}', '{review_time}'),")
    # Add a random number of reviews for each restaurant
    review_id += 1
    if random.random() < 0.5:  # 50% chance to add another review for the same restaurant
        rid = random.choice(restaurant_ids)
        uid = random.randint(1, 50)
        rating = round(random.uniform(1.0, 5.0), 1)
        feedback = fake.sentence().replace("'", "")
        review_time = fake.date_time_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d %H:%M:%S')
        lines.append(f"({review_id}, {rid}, {uid}, {rating}, '{feedback}', '{review_time}'),")
        review_id += 1
lines[-1] = lines[-1].rstrip(',') + ';'
lines.append("")

# Insert Feedback Labels
lines.append("-- Feedback Labels")
lines.append("INSERT INTO Feedback_label (feedback_label_id, label, rating_label, rating_id) VALUES ")
labels = ["food", "service", "delivery", "price", "ambience"]
label_id = 1
for rid in range(1, review_id):
    for _ in range(random.randint(1, 2)):  # about 300 total
        label = random.choice(labels)
        rating_val = round(random.uniform(1.0, 5.0), 2)
        lines.append(f"({label_id}, '{label}', {rating_val}, {rid}),")
        label_id += 1
lines[-1] = lines[-1].rstrip(',') + ';'

# Insert Temp
lines.append("-- Temp")
lines.append("INSERT INTO Temp (UniqueID, restaurant_id, platform_id, restaurant_rating) VALUES ")
temp_id = 1
for _ in range(50):
    rid = random.choice(restaurant_ids)
    pid = random.choice([1, 2])
    rating = round(random.uniform(2.5, 5.0), 2)
    lines.append(f"({temp_id}, {rid}, {pid}, {rating}),")
    temp_id += 1
lines[-1] = lines[-1].rstrip(',') + ';'
lines.append("")

file_path = 'init_script.sql'
with open(file_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
