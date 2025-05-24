import Lottie from "react-lottie-player";
import morphicLoaderLottie from "../../public/lotties/morphic-loader.json";
import morphicLoaderDarkLottie from "../../public/lotties/morphic-loader-dark.json";
import { useRef } from "react";

export function LoadingPage() {
	const lottieRef = useRef(null);

	return (
		<main className="flex h-screen w-screen flex-row items-center justify-center">
			<Lottie
				ref={lottieRef}
				loop
				play
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
		</main>
	);
}
