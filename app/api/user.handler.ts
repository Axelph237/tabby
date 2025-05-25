// TODO Create better error formatting for response errors
export async function getMe(): Promise<IUser> {
	const domain = import.meta.env.VITE_API_DOMAIN || "http://localhost:3000";

	const response = await fetch(`${domain}/user/me`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) throw new Error("Bad response");

	return await response.json();
}

export interface IUser {
	email?: string;
}

export default { getMe };
