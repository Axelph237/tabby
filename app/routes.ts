import {
	type RouteConfig,
	index,
	route,
	prefix,
	layout,
} from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	// Login page
	...prefix("/auth", [
		layout("routes/auth/auth.layout.tsx", [
			index("routes/auth/login/login.view.tsx"),
		]),
		route("callback", "routes/auth/callback/callback.view.tsx"),
	]),
	// Menu page
	route("/menu/:sessId", "routes/menu/menu.view.tsx"),
	// Checkout page
	route("/checkout/:menuId", "routes/checkout/checkout.view.tsx"),
	// Status page
	route("/order/status", "routes/status.tsx"),
	route("/order/ready", "routes/ready.tsx"),
] satisfies RouteConfig;
