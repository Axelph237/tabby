import "/app/routes/guest/menu/menu.css";
import { Outlet, useNavigate, useSearchParams } from "react-router";
import { TabbyLogo } from "~/lib/components/icons";
import { useEffect, useRef, useState } from "react";
import Auth from "~/api/user.handler";
import "./auth.css";
import checkmarkLottie from "../../../public/lotties/checkmark.json";
import type { LottiePlayer } from "lottie-web";
import ClientLottie from "~/lib/components/client-lottie";

export default function AuthPage() {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const lottieRef = useRef(null);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		const verifyLogin = (msg: MessageEvent<any>) => {
			console.log("Received message");

			if (msg.data != "tabby.oauth_login.done") return;

			console.log("Completed auth");

			Auth.getMe()
				.then((data) => {
					setLoggedIn(true);
					setTimeout(() => {
						(lottieRef.current! as LottiePlayer).play();
					}, 200);
				})
				.catch((err) => console.error(err));
		};

		window.addEventListener("message", verifyLogin);
		return () => {
			window.removeEventListener("message", verifyLogin);
		};
	}, []);

	const navigateToDashboard = () => {
		navigate(searchParams.get("from") ?? "dashboard");
	};

	return (
		<main
			id="order-page-main"
			className="relative flex h-screen w-screen flex-col justify-end overflow-hidden px-[20px]"
		>
			<div
				id="checkout-header"
				className="top-0 z-10 flex w-full flex-row items-center justify-between text-primary"
			>
				<h1 className="font-dongle text-[64px]">Tabby</h1>
				<TabbyLogo className="h-26 w-26" />
			</div>
			{/* Menu */}
			<div
				id="auth-container"
				className={`${loggedIn && "slide-auth-body-out"} relative top-[30px] flex h-full flex-col`}
			>
				<div className="flex flex-row items-end justify-end">
					<div className="auth-header relative right-0 w-1/2 bg-primary">
						<h1 className="flex items-center justify-center font-dongle text-[64px] font-semibold text-accent">
							Login
						</h1>
					</div>
				</div>
				<div className="auth-body z-50 flex h-full flex-col items-center justify-start bg-primary p-[20px] shadow-lg sm:p-[30px] md:p-[50px] lg:p-[60px]">
					{/*	Input */}
					<Outlet />
				</div>
			</div>
			<div
				className={`${!loggedIn && "hidden"} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
			>
				<ClientLottie
					ref={lottieRef}
					loop={false}
					animationData={checkmarkLottie}
					onComplete={navigateToDashboard}
					className="h-full w-full"
				/>
			</div>
		</main>
	);
}
