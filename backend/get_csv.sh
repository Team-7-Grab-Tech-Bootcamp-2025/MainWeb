container_id=$(docker ps --filter "name=backend-app-1" -q)

docker cp $container_id:/tmp/restaurant_ratings.csv ./restaurant_rating.csv