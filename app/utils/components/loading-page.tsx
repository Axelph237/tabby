import Lottie from "react-lottie-player";
import morphicLoaderLottie from "../../../public/lotties/morphic-loader.json";
import { motion } from "framer-motion";

export function LoadingPage() {
	return (
		<motion.main
			className="flex h-screen w-screen flex-row items-center justify-center"
			exit={{ opacity: 0 }}
		>
			<Lottie
				loop
				play
				speed={1.25}
				color="white"
				animationData={morphicLoaderLottie}
				className="aspect-square h-full"
			/>
			{/*<Lottie*/}
			{/*  ref={lottieRef}*/}
			{/*  loop*/}
			{/*  play*/}
			{/*  color="white"*/}
			{/*  animationData={morphicLoaderDarkLottie}*/}
			{/*  className="h-full aspect-square hidden dark:block"*/}
			{/*/>*/}
		</motion.main>
	);
}
