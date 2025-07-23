import {
	CaretDownIcon,
	PenIcon,
	TabbyLogo,
	TrashIcon,
} from "~/lib/components/icons";
import {
	type ChangeEvent,
	type ComponentProps,
	Fragment,
	useEffect,
	useRef,
	useState,
} from "react";
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
	const [editing, setEditing] = useState(false);
	const [checkoutItems, setCheckoutItems] = useState<
		(ItemWithOpts & { count: number })[] | undefined
	>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	// Load cart on component mount
	useEffect(() => {
		// Get saved cart data
		const savedCart = Cart.get(STORAGE_KEY);
		// console.log("Cart:", savedCart);
		setCart(savedCart);
	}, []);

	// Verify cart data to current menu on cart load
	useEffect(() => {
		if (!cart) return;

		fetch(`/api/sessions/${sessId}`, {
			method: "GET",
			credentials: "include",
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				throw new Error("Failed to get session.");
			})
			.then((sess: SessionDetails) => {
				// console.log(sess);
				const { items, ...menu } = sess.menu;

				setMenu(menu);

				const checkout: (ItemWithOpts & { count: number })[] = [];
				for (const i of items) {
					if (cart.getItems()[i.id])
						checkout.push({ ...i, count: cart.getItems()[i.id] });
				}
				setCheckoutItems(checkout);
			})
			.catch((err) => console.log(err));
	}, [cart]);

	// useEffect(() => {
	// 	if (!menu || !cart) return;

	// 	fetch(`/api/items?${new URLSearchParams({ menuId: menu.id })}`, {
	// 		method: "GET",
	// 		credentials: "include",
	// 	})
	// 		.then((res) => {
	// 			if (res.status === 200) return res.json();
	// 			return undefined;
	// 		})
	// 		.then((items: ItemWithOpts[]) => {
	// 			const checkout: (ItemWithOpts & { count: number })[] = [];
	// 			for (const i of items) {
	// 				if (cart.getItems()[i.id])
	// 					checkout.push({ ...i, count: cart.getItems()[i.id] });
	// 			}
	// 			setCheckoutItems(checkout);
	// 		})
	// 		.catch((err) => console.error(err));
	// }, [menu]);

	const handleDeleteClicked = (itemId: number) => {
		if (checkoutItems === undefined || cart === undefined) return;

		cart?.setItem(itemId, 0);
		Cart.save(STORAGE_KEY, cart);
		setCheckoutItems(checkoutItems?.filter((item) => item.id !== itemId));
	};

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

		const order = {
			guestName,
			cart: cart.toUnfoldedArray(),
		};
		console.log("Order:", order);
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
			<BackBtn sessId={sessId} />

			{/* body */}
			<div
				id="checkout-body"
				className="w-full font-red-hat-mono text-[20px]"
			>
				<p className="flex flex-row items-center justify-between">
					<span className="flex w-full flex-row items-center gap-4">
						QTY ITEM
						<button
							className="flex aspect-square cursor-pointer flex-row items-center justify-center rounded-xl bg-accent p-2 text-primary transition-all duration-150 hover:scale-105"
							onClick={() => setEditing(!editing)}
						>
							<PenIcon className="icon-xs" />
						</button>
					</span>
					<span>PRICE</span>
				</p>

				<FullWidthDottedLine />

				<ul className="flex flex-col gap-[10px] font-dongle text-[36px] text-primary">
					{checkoutItems &&
						checkoutItems.map((item, i) => (
							<li
								className="flex h-[64px] flex-row gap-1"
								key={i}
							>
								{editing && (
									<DeleteButton
										i={i}
										onClick={() => handleDeleteClicked(item.id)}
									/>
								)}
								<CheckoutItem item={item} />
							</li>
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

function BackBtn({ sessId }: { sessId: string }) {
	return (
		<motion.div
			animate={{ y: [0, -5, 0, -5, 0] }}
			transition={{ repeat: Infinity, repeatDelay: 5 }}
			className="flex w-full justify-center"
		>
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
		</motion.div>
	);
}

function DeleteButton({ i, onClick }: { i: number; onClick: () => void }) {
	const handleClick = () => {
		console.log("Delete clicked");
		onClick();
	};

	return (
		<motion.button
			onClick={handleClick}
			transition={{ delay: Number(i) * 0.05 }}
			initial={{
				width: 0,
				height: 0,
				opacity: 0,
				transform: "translate(50%, 50%)",
				scale: 1,
			}}
			animate={{
				width: "50px",
				height: "50px",
				opacity: 0.65,
				transform: "translate(0,0)",
				scale: 1,
			}}
			whileHover={{ opacity: 1, scale: 1.05 }}
			className="m-2 flex aspect-square cursor-pointer items-center justify-center rounded-2xl bg-red-600 bg-linear-to-bl p-2 shadow-lg"
		>
			<TrashIcon className="icon-md" />
		</motion.button>
	);
}

function CheckoutItem({ item }: { item: ItemWithOpts & { count: number } }) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0, left: "-100%" }}
			animate={{ opacity: 1, scale: 1, left: "0px" }}
			transition={{ delay: 0.1 }}
			className="layered relative size-full items-center justify-center overflow-hidden rounded-2xl bg-secondary"
		>
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
		</motion.div>
	);
}
