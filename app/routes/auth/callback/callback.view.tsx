import { useEffect } from "react";
import Cookies from "cookie";

export default function LoginCallbackPage() {
	useEffect(() => {
		window.opener.postMessage("tabby.oauth_login.done");
		window.close();
	}, []);

	return <p>Redirecting</p>;
}
