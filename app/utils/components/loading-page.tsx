import morphicLoaderLottie from "../../../public/lotties/morphic-loader.json";
import { motion } from "framer-motion";
import ClientLottie from "./client-lottie";

export function LoadingPage() {
	console.log("Loading page rendered");

	return (
		<motion.main
			className="flex h-screen w-screen flex-row items-center justify-center"
			exit={{ opacity: 0 }}
		>
			<ClientLottie
				loop
				play
				speed={1.25}
				color="white"
				animationData={morphicLoaderLottie}
				className="aspect-square h-full"
			/>
		</motion.main>
	);
}
