import { TabbyLogo } from "~/utils/components/icons";
import { type ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import Cart, { type CartItem } from "~/utils/cart";
import { requestOrder } from "~/routes/guest/checkout/checkout.handler";
import { motion } from "motion/react";
import FullWidthDottedLine from "~/utils/components/full-width-dotted-line";

export default function CheckoutPage({
	params: { menuId },
}: {
	params: { menuId: string };
}) {
	const STORAGE_KEY = `menu:${menuId}`;
	const [name, setName] = useState("");
	const [cart, setCart] = useState<Cart | undefined>(undefined);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const sessionData = sessionStorage.getItem(STORAGE_KEY);
		const parsedData = JSON.parse(sessionData ?? "{}");

		if (Cart.isCart(parsedData))
			setCart(new Cart(parsedData)); // No cart data found
		else setCart(new Cart());
	}, []);

	const handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
		const text = (inputRef.current! as HTMLInputElement).value;
		setName(text);
	};

	const handleFocus = () => {
		if (inputRef.current) (inputRef.current as HTMLElement).focus();
	};

	const handleSubmit = () => {
		const guestName = (inputRef?.current as HTMLInputElement).value;

		if (!cart || !guestName || guestName === "") {
			console.log("Please enter valid name.");
			return;
		}

		requestOrder(menuId, guestName, cart)
			.then((res) => console.log("Created order:", res))
			.catch((err) => console.log(err));
	};

	return (
		<motion.div
			id="checkout-container"
			className="relative flex h-fit min-h-screen flex-col items-center justify-start gap-[25px] bg-primary px-[20px] text-accent"
			initial={{ top: "3000px", opacity: 0 }}
			animate={{ top: 0, opacity: 1 }}
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

				<FullWidthDottedLine />

				<ul className="flex flex-col gap-[10px] font-dongle text-[36px] text-primary">
					{cart &&
						cart.items.map((item, i) => (
							<Fragment key={i}>
								<CheckoutItem item={item} />
							</Fragment>
						))}
				</ul>

				<FullWidthDottedLine />

				<p className="flex flex-row justify-between">
					<span>TOTAL</span>
					<span>${((cart?.totalCost ?? 0) / 100).toFixed(2)}</span>
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
		</motion.div>
	);
}

function CheckoutItem({ item }: { item: CartItem }) {
	return (
		<div className="layered h-[64px] w-full items-center justify-center overflow-hidden rounded-2xl bg-secondary">
			{item.img_url && (
				<img
					src={item.img_url}
					alt={item.name}
					className="top-0 left-0 aspect-auto w-[120%] object-cover opacity-[0.2] blur-lg"
				/>
			)}
			<p className="mx-6 flex flex-row items-center justify-between">
				<span>
					{item.count} {item.name}
				</span>
				<span>${((item.count * item.unit_price) / 100).toFixed(2)}</span>
			</p>
		</div>
	);
}
