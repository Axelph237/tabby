import {
	Outlet,
	redirect,
	redirectDocument,
	useLocation,
	useNavigate,
} from "react-router";
import User, { type IUser } from "~/api/user.handler";

export async function clientLoader() {
	const redirectUrl =
		"/auth?" + new URLSearchParams({ from: location.pathname });

	const user = await User.getMe();

	if (user.email) {
		return user;
	} else {
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
