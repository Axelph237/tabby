import { Value } from "@sinclair/typebox/value";
import { type UUID, uuidObj } from "~/utils/types/uuid";
import type { SessionDetails } from "~/routes/menu/menu.validation";
import type { FailedRequest } from "~/utils/types/failedRequest";

export async function getSession(id: UUID): Promise<SessionDetails> {
	const url = `/sessions/${id}`;

	const response = await fetch(url, { method: "GET" });
	const body = await response.json();

	if (!response.ok) {
		throw new Error("Failed to get session.");
	}

	return body;
}
