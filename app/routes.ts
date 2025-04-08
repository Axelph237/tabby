import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	// Login page
	route("/auth", "routes/auth/auth.view.tsx", [
		index("routes/auth/login.view.tsx"),
		route("callback", "routes/auth/callback/callback.view.tsx"),
	]),
	route("/menu/:sessId", "routes/menu/menu.view.tsx"),
	route("/checkout/:menuId", "routes/checkout.tsx"),
	route("/order/status", "routes/status.tsx"),
	route("/order/ready", "routes/ready.tsx"),
] satisfies RouteConfig;
