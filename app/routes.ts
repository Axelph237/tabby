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

	// Guest routes
	route("/guest", "routes/guest/guest.layout.tsx", [
		// TODO Add index page
		// Menu page
		route("menu/:sessId", "routes/guest/menu/menu.view.tsx"),
		// Checkout page
		route("checkout/:sessId", "routes/guest/checkout/checkout.view.tsx"),
		// Status page
		route("order/status", "routes/guest/status.tsx"),
		route("order/ready", "routes/guest/ready.tsx"),
	]),

	// Protected routes
	layout("utils/layouts/authenticated-layout.tsx", [
		// Dashboard
		route("/dashboard", "routes/dashboard/dashboard.layout.tsx", [
			index("routes/dashboard/dashboard.view.tsx"),
			// Edit page
			route("edit/:menuId", "routes/dashboard/edit/edit.layout.tsx", [
				// Display menu
				route("menu", "routes/dashboard/edit/menu/menu.view.tsx"),
				// Edit item on menu
				route("item/:itemId", "routes/dashboard/edit/item/item.view.tsx"),
			]),
		]),
	]),
] satisfies RouteConfig;
