import type { Menu } from "~/routes/guest/menu/menu.validation";

const domain = import.meta.env.VITE_API_DOMAIN || "http://localhost:3000";

export async function createMenu(
	menu: Omit<Menu, "id" | "created_at" | "created_by">,
): Promise<Menu> {
	const url = `${domain}/menus`;

	const response = await fetch(url, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(menu),
	});

	if (!response.ok) {
		throw new Error("Failed to create menu.");
	}

	return response.json();
}

export default { createMenu };
