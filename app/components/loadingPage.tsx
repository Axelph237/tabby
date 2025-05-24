import Lottie from "react-lottie-player";
import morphicLoaderLottie from "../../public/lotties/morphic-loader.json";

export function LoadingPage() {
	return (
		<main className="flex h-screen w-screen flex-row items-center justify-center">
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
		</main>
	);
}
