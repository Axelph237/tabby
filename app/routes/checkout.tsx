import { TabbyLogo } from "~/components/icons";
import {
	type ChangeEvent,
	type FormEvent,
	Fragment,
	useEffect,
	useRef,
	useState,
} from "react";
// import { isItem, type Item } from "~/lib/item";
import { Router } from "react-router";
import type { Item } from "~/routes/menu/menu.validation";

const tTotal = 10.56;

export default function CheckoutPage({
	params,
}: {
	params: { menuId: string };
}) {
	const [cartItems, setCartItems] = useState<undefined>(undefined);
	const [name, setName] = useState("");
	const inputRef = useRef(null);

	// useEffect(() => {
	// 	const menuId = params.menuId;
	// 	const sessionData = sessionStorage.getItem(menuId);
	//
	// 	if (sessionData) {
	// 		const cartData: Item[] = JSON.parse(sessionData);
	//
	// 		const items = [];
	// 		for (let i = 0; i < cartData.length; i++) {
	// 			if (isItem(cartData[i])) items.push(cartData[i]);
	// 		}
	//
	// 		setCartItems(items);
	// 	} else {
	// 		// No menu data found
	// 		throw Error(`Failed to find cart data for menuId ${menuId}`);
	// 	}
	// }, []);

	const handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
		const text = (inputRef.current! as HTMLInputElement).value;
		setName(text);
	};

	const handleFocus = () => {
		if (inputRef.current) (inputRef.current as HTMLElement).focus();
	};

	const handleSubmit = () => {
		console.log("Placing order");
	};

	return (
		<main className="h-screen overflow-y-auto">
			<div
				id="checkout-container"
				className="relative flex h-fit min-h-screen flex-col items-center justify-start gap-[25px] bg-primary px-[20px] text-accent"
			>
				{/* header */}
				<div
					id="checkout-header"
					className="top-0 z-10 flex w-full flex-row items-center justify-between bg-primary text-accent"
				>
					<h1 className="font-dongle text-[64px]">Tabby</h1>
					<TabbyLogo className="h-26 w-26" />
				</div>
				{/* body */}
				<div
					id="checkout-body"
					className="w-full font-red-hat-mono text-[20px]"
				>
					<p className="flex flex-row justify-between">
						<span>QTY ITEM</span>
						<span>PRICE</span>
					</p>
					<svg
						width="100%"
						height="30"
					>
						<line
							x1="0"
							y1="15"
							x2="100%"
							y2="15"
							stroke="var(--color-accent)"
							strokeWidth="1.5"
							strokeDasharray="10,5"
						/>
					</svg>

					<ul className="flex flex-col gap-[10px] font-dongle text-[36px] text-primary">
						{/*{cartItems &&*/}
						{/*	cartItems.map((item, i) => (*/}
						{/*		<Fragment key={i}>*/}
						{/*			<CheckoutItem*/}
						{/*				item={item}*/}
						{/*				count={i + 1}*/}
						{/*			/>*/}
						{/*		</Fragment>*/}
						{/*	))}*/}
					</ul>

					<svg
						width="100%"
						height="30"
					>
						<line
							x1="0"
							y1="15"
							x2="100%"
							y2="15"
							stroke="var(--color-accent)"
							strokeWidth="1.5"
							strokeDasharray="10,5"
						/>
					</svg>
					<p className="flex flex-row justify-between">
						<span>TOTAL</span>
						<span>${tTotal.toFixed(2)}</span>
					</p>
				</div>

				{/* signature */}
				<div className="flex w-3/4 flex-col gap-1">
					<label className="text-[20px] font-medium">Signature</label>
					<div
						id="checkout-signature"
						className="flex cursor-pointer flex-col overflow-hidden rounded-xl bg-accent px-6 py-2 text-primary"
						onClick={handleFocus}
					>
						<p className="font-redacted-script text-6xl text-nowrap">
							{name === "" ? "Your Name" : name}
						</p>
						<input
							type="text"
							className="w-full outline-none"
							ref={inputRef}
							placeholder="Your Name"
							onChange={handleNameInput}
						/>
					</div>
				</div>

				<div className="mb-[20px] flex w-full flex-row justify-end">
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
			{item.img_url && (
				<img
					src={item.img_url}
					alt={item.name}
					className="top-0 left-0 aspect-auto w-[120%] object-cover opacity-35 blur-lg"
				/>
			)}
			<p className="mx-6">
				{count} {item.name}
			</p>
		</div>
	);
}
