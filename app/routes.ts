import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/order", "routes/order.tsx"),
] satisfies RouteConfig;
