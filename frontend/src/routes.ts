import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("./routes/home.tsx"),
    route("about", "./routes/about.tsx"),
    route("cuisine/:cuisineId", "./routes/cuisine.tsx"),
  ]),
] satisfies RouteConfig;
