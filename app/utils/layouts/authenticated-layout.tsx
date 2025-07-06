import { Outlet, redirect } from "react-router";
import User, { type IUser } from "~/api/user.handler";

export async function clientLoader() {
	const redirectUrl =
		"/auth?" + new URLSearchParams({ from: location.pathname });

	try {
		const user = await User.getMe();

		if (user.email) return user;
		else throw new Error("User email could not be found");
	} catch (err) {
		console.error(err);
		throw redirect(redirectUrl);
	}
}

export default function AuthenticatedLayout({
	loaderData,
}: {
	loaderData?: IUser;
}) {
	return <Outlet context={{ user: loaderData }} />;
}
