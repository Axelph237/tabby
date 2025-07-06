import {
	BurgerIcon,
	CheckIcon,
	FireIcon,
	SendIcon,
	TabbyLogo,
} from "~/lib/components/icons";
import checkmarkLottie from "../../../public/lotties/checkmark.json";
import ClientLottie from "~/lib/components/client-lottie";

export default function QueuePage() {
	return (
		<main className="h-screen">
			<div className="flex h-full flex-col">
				{/* top */}
				<div className="px-[20px]">
					{/* header */}
					<div
						id="status-header"
						className="top-0 z-10 flex w-full flex-row items-center justify-between text-primary"
					>
						<h1 className="font-dongle text-[64px]">Tabby</h1>
						<TabbyLogo className="h-26 w-26" />
					</div>
				</div>
				{/* body */}
				<div className="flex h-full flex-col items-center justify-center gap-[20px] p-[20px]">
					<h1 className="px-[20px] text-center font-red-hat-display text-[48px] font-bold text-wrap">
						Your Order Is Ready
					</h1>

					<div className="flex aspect-square w-1/2 max-w-[300px] items-center justify-center">
						<ClientLottie
							loop={false}
							animationData={checkmarkLottie}
							play
							style={{ width: "100%", height: "100%" }}
						/>
					</div>

					<div>
						<p className="text-center text-[36px]">Your Name</p>
						<p className="text-center text-[36px] opacity-50">#198</p>
					</div>
				</div>
			</div>
		</main>
	);
}
