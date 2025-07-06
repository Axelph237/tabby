import { type Route } from "../../.react-router/types/app/+types/root";
// import logoDark from "../../public/react-router/logo-dark.svg";
// import logoLight from "../../public/react-router/logo-light.svg";
import { PlayIcon, TabbyLogo } from "~/lib/components/icons";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function HomePage() {
	const navigate = useNavigate();

	const handleNavigate = (): void => {
		navigate("dashboard");
	};

	return (
		<main className="flex min-h-screen w-screen flex-col items-center justify-start gap-15 overflow-x-hidden bg-primary px-[20px] text-accent">
			<div className="w-full">
				<div
					id="home-header"
					className="top-0 z-10 flex w-full flex-row items-center justify-between"
				>
					<h1 className="font-dongle text-[64px]">Tabby</h1>
					<TabbyLogo className="h-26 w-26" />
				</div>
				<svg
					width="100%"
					height="2"
				>
					<line
						x1="0"
						y1="1"
						x2="100%"
						y2="1"
						stroke="var(--color-accent)"
						strokeWidth="2"
						strokeDasharray="10,5"
					/>
				</svg>
			</div>

			<p className="line text-left font-red-hat-display text-[64px]/[70px] font-light">
				Let's keep{" "}
				<span className="font-semibold text-secondary italic">tabs</span> on
				those orders
			</p>

			<button
				className="relative right-0 left-[50px] flex cursor-pointer flex-row items-center justify-start gap-4 place-self-end rounded-xl bg-accent px-6 py-3 pr-[80px] font-red-hat-mono text-[36px] text-primary transition-all duration-300 hover:pr-[150px] hover:text-secondary"
				onClick={handleNavigate}
			>
				Create Menu
				<PlayIcon className="icon-sm" />
			</button>

			<p className="text-right font-red-hat-display text-[64px]/[70px] font-light">
				<span className="font-semibold text-secondary italic">Simplicity</span>{" "}
				is the recipe
			</p>
		</main>
	);
}
