import { CaretDownIcon, TabbyLogo } from "~/lib/components/icons";
import { type ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { requestOrder } from "~/routes/guest/checkout/checkout.handler";
import Cart from "../menu/cart";
import { motion } from "motion/react";
import FullWidthDottedLine from "~/lib/components/full-width-dotted-line";
import {
	type Menu,
	type Item,
	type SessionDetails,
	type ItemWithOpts,
} from "../menu/menu.validation";
import FullWidthLine from "~/lib/components/full-width-line";
import { Link } from "react-router";

export default function CheckoutPage({
	params: { sessId },
}: {
	params: { sessId: string };
}) {
	const STORAGE_KEY = `menu:${sessId}`;
	const [name, setName] = useState("");
	const [cart, setCart] = useState<Cart | undefined>(undefined);
	const [menu, setMenu] = useState<Menu | undefined>(undefined);
	const [checkoutItems, setCheckoutItems] = useState<
		(ItemWithOpts & { count: number })[] | undefined
	>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Get saved cart data
		const savedCart = Cart.get(STORAGE_KEY);
		console.log("Cart:", savedCart);
		setCart(savedCart);

		fetch(`/api/sessions/${sessId}`, {
			method: "GET",
			credentials: "include",
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				throw new Error("Failed to get session.");
			})
			.then((sess: SessionDetails) => setMenu(sess.menu))
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		if (!menu || !cart) return;

		fetch(`/api/items?${new URLSearchParams({ menuId: menu.id })}`, {
			method: "GET",
			credentials: "include",
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				return undefined;
			})
			.then((items: ItemWithOpts[]) => {
				const checkout: (ItemWithOpts & { count: number })[] = [];
				for (const i of items) {
					if (cart.getItems()[i.id])
						checkout.push({ ...i, count: cart.getItems()[i.id] });
				}
				setCheckoutItems(checkout);
			})
			.catch((err) => console.error(err));
	}, [menu]);

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
	};

	return (
		<motion.div
			id="checkout-container"
			className="relative flex h-fit min-h-screen flex-col items-center justify-start gap-[25px] bg-primary px-[20px] text-accent"
			initial={{ top: "3000px", opacity: 0 }}
			animate={{ top: 0, opacity: 1 }}
			exit={{ top: "3000px", opacity: 0 }}
		>
			{/* header */}
			<div
				id="checkout-header"
				className="top-0 z-10 flex w-full flex-row items-center justify-between bg-primary text-accent"
			>
				<h1 className="font-dongle text-[64px]">Tabby</h1>
				<TabbyLogo className="h-26 w-26" />
			</div>
			{/* back button */}
			<Link
				to={`../menu/${sessId}`}
				className="flex w-1/2 cursor-pointer flex-row gap-6 transition-all duration-150 hover:scale-105"
			>
				<FullWidthLine />
				<span className="w-fit font-medium text-nowrap">Back To</span>
				<div className="rounded-full bg-accent p-1 text-primary">
					<CaretDownIcon className="icon-sm rotate-180" />
				</div>
				<span className="font-medium">Menu</span>
				<FullWidthLine />
			</Link>
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
					{checkoutItems &&
						checkoutItems.map((item, i) => (
							<Fragment key={i}>
								<CheckoutItem item={item} />
							</Fragment>
						))}
				</ul>

				<FullWidthDottedLine />

				<p className="flex flex-row justify-between">
					<span>TOTAL</span>
					<span>
						$
						{(
							(checkoutItems?.reduce(
								(a: number, curr) => a + curr.basePrice * curr.count,
								0,
							) ?? 0) / 100
						).toFixed(2)}
					</span>
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

function CheckoutItem({ item }: { item: ItemWithOpts & { count: number } }) {
	return (
		<div className="layered h-[64px] w-full items-center justify-center overflow-hidden rounded-2xl bg-secondary">
			{item.imgUrl && (
				<img
					src={item.imgUrl}
					alt={item.name}
					className="top-0 left-0 aspect-auto w-[120%] object-cover opacity-[0.2] blur-lg"
				/>
			)}
			<p className="mx-6 flex flex-row items-center justify-between">
				<span>
					{item.count} {item.name}
				</span>
				<span>${((item.count * item.basePrice) / 100).toFixed(2)}</span>{" "}
				{/* TODO fix base price when adding selections */}
			</p>
		</div>
	);
}
