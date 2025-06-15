import { type FC, useEffect, useState } from "react";
import type { LottieProps } from "react-lottie-player";

export default function ClientLottie(props: LottieProps) {
	const [Lottie, setLottie] = useState<FC<LottieProps> | null>(null);

	useEffect(() => {
		import("react-lottie-player").then((module) => setLottie(module.default));
	}, []);

	return Lottie && <Lottie {...props} />;
}
