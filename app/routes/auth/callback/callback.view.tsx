import { useEffect } from "react";
import Cookies from "cookie";

export default function LoginCallbackPage() {
	useEffect(() => {
		if (window.opener) {
			window.opener.postMessage("tabby.oauth_login.done");
			window.close();
		}
	}, []);

	return (
		<main className="flex h-screen flex-col items-center justify-center">
			<h1 className="font-red-hat-display text-[10vw] font-extrabold">
				Login completed
			</h1>
			<h2 className="font-red-hat-display text-[7vw] font-extrabold opacity-60">
				Redirecting...
			</h2>
		</main>
	);
}
