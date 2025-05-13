import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("./routes/home.tsx"),
    route("cuisines", "./routes/cuisines.tsx"),
    route("cuisine/:cuisineId", "./routes/cuisine.tsx"),
    route("search", "./routes/search.tsx"),
    route("restaurants", "./routes/restaurants.tsx"),
    route("restaurant/:restaurantId", "./routes/restaurant.tsx"),
    route("ask", "./routes/ask.tsx"),
  ]),
] satisfies RouteConfig;
