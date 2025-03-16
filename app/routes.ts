import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/menu/:menuId", "routes/menu.tsx"),
	route("/checkout/:menuId", "routes/checkout.tsx"),
	route("/order/status", "routes/status.tsx"),
	route("/order/ready", "routes/ready.tsx"),
] satisfies RouteConfig;
