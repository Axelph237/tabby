import { TabbyLogo } from "~/components/icons";
import { type ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import type { Item } from "~/lib/item";
import { tItems } from "~/lib/testTypes";

const tTotal = 10.56;

export default function CheckoutPage() {
	const [name, setName] = useState("");
	const inputRef = useRef(null);

	const getMaxCharacters = (pElem: HTMLElement, sampleText = "W") => {
		let testSpan = document.createElement("span");
		testSpan.style.visibility = "hidden"; // Hide it
		testSpan.style.fontFamily = "Red Hat Mono";
		testSpan.style.fontSize = "20px";
		testSpan.innerText = sampleText;
		document.body.appendChild(testSpan);

		let charWidth = testSpan.offsetWidth; // Get width of one character
		let maxChars = Math.floor(pElem.clientWidth / charWidth);

		document.body.removeChild(testSpan); // Cleanup
		return maxChars;
	};

	useEffect(() => {
		const updateDashes = () => {
			const pt = document.getElementById("dashes-t");
			const pb = document.getElementById("dashes-b");

			if (pt && pb) {
				const maxChars = getMaxCharacters(pt, "-");

				pt!.innerText = "-".repeat(maxChars);
				pb!.innerText = "-".repeat(maxChars);
			}
		};

		const handleScroll = () => {
			const main = document.querySelector("main");
			const scale = Math.min(main!.scrollTop / 100, 1);

			if (scale > 0.0001) {
				document.getElementById("checkout-header")!.style.boxShadow =
					`0 ${scale * 5}px 6px rgba(0, 0, 0, 0.2)`;
			} else {
				document.getElementById("checkout-header")!.style.boxShadow = "none";
			}
		};

		updateDashes();
		window.addEventListener("resize", updateDashes);
		document.querySelector("main")?.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("resize", updateDashes);
			document
				.querySelector("main")
				?.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleFocus = () => {
		if (inputRef.current) (inputRef.current as HTMLElement).focus();
	};

	const handleSubmit = () => {
		console.log("Placing order");
	};

	return (
		<main className="h-screen overflow-y-auto">
			{/* header */}
			<div
				id="checkout-header"
				className="sticky top-0 z-10 flex w-full flex-row items-center justify-between bg-primary px-6 text-accent"
			>
				<h1 className="font-dongle text-[64px]">Tabby</h1>
				<TabbyLogo className="h-26 w-26" />
			</div>

			<div
				id="checkout-container"
				className="relative flex h-fit min-h-screen flex-col items-center justify-start gap-[25px] bg-primary p-[20px] text-accent"
			>
				{/* body */}
				<div
					id="checkout-body"
					className="w-full font-red-hat-mono text-[20px]"
				>
					<p className="flex flex-row justify-between">
						<span>QTY ITEM</span>
						<span>PRICE</span>
					</p>
					<p
						id="dashes-t"
						className="dashes max-w-full overflow-x-hidden text-nowrap"
					></p>

					<ul className="flex flex-col gap-[10px] font-dongle text-[36px] text-primary">
						{tItems &&
							tItems.map((item, i) => (
								<Fragment key={i}>
									<CheckoutItem
										item={item}
										count={i + 1}
									/>
								</Fragment>
							))}
					</ul>

					<p
						id="dashes-b"
						className="dashes max-w-full overflow-x-hidden text-nowrap"
					></p>
					<p className="flex flex-row justify-between">
						<span>TOTAL</span>
						<span>${tTotal.toFixed(2)}</span>
					</p>
				</div>

				{/* signature */}
				<div
					id="checkout-signature"
					className="flex w-3/4 cursor-pointer flex-col overflow-hidden rounded-xl bg-accent px-6 py-2 text-primary"
					onClick={handleFocus}
				>
					<p className="font-redacted-script text-6xl text-nowrap">
						{name == "" ? "Your Name" : name}
					</p>
					<input
						type="text"
						className="w-full outline-none"
						ref={inputRef}
						placeholder="Your Name"
						onInput={handleNameInput}
					/>
				</div>

				<div className="flex w-full flex-row justify-end">
					<button
						className="btn px-8 py-4 text-primary"
						onClick={handleSubmit}
					>
						Place Order
					</button>
				</div>
			</div>
		</main>
	);
}

function CheckoutItem({ item, count }: { item: Item; count: number }) {
	return (
		<div className="layered h-[64px] w-full items-center justify-center overflow-hidden rounded-2xl bg-secondary">
			<img
				src={item.imgUrl}
				alt={item.name}
				className="top-0 left-0 aspect-auto w-[120%] object-cover opacity-35 blur-lg"
			/>
			<p className="mx-6">
				{count} {item.name}
			</p>
		</div>
	);
}
