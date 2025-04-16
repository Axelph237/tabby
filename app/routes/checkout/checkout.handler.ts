import type Cart from "~/utils/cart";

const domain = import.meta.env.VITE_API_DOMAIN || "http://localhost:3000";

export async function requestOrder(
	sessId: string,
	guestName: string,
	cart: Cart,
): Promise<boolean> {
	const URL = `${domain}/orders/${sessId}`;

	const order = {
		guest_name: guestName,
		placed_at: Date.now(),
		items: cart.items.map((item) => ({
			// Remove unnecessary keys for order
			item_id: item.id,
			selections: item.selections,
			count: item.count,
		})),
	};

	const response = await fetch(URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(order),
	});

	if (!response.ok) throw new Error("Failed to request order.");

	return true;
}
