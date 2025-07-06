import { useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import AnimatedOutlet from "~/lib/components/animated-outlet";

export default function GuestLayout() {
	const location = useLocation();

	return (
		<main
			id="guest-main"
			className="no-scroll h-screen w-screen overflow-y-auto bg-primary"
		>
			<AnimatePresence mode="wait">
				<AnimatedOutlet key={location.pathname} />
			</AnimatePresence>
		</main>
	);
}
