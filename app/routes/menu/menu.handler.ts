import { type UUID } from "~/utils/types/uuid";
import type { SessionDetails } from "~/routes/menu/menu.validation";

const domain = import.meta.env.VITE_API_DOMAIN || "http://localhost:3000";

export async function getSession(id: UUID): Promise<SessionDetails> {
	const url = `${domain}/sessions/${id}`;
	console.log("Getting url");

	const response = await fetch(url, { method: "GET" });
	const body = await response.json();

	if (!response.ok) {
		throw new Error("Failed to get session.");
	}

	return body;
}
