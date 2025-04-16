import "/app/routes/menu/menu.css";
import { Fragment, type HTMLProps, useEffect, useState } from "react";
import { ReceiptIcon } from "~/components/icons";
import { Link } from "react-router";
import Cart, { type CartItem } from "~/utils/cart";
import type {
	ItemWithOpts,
	SessionDetails,
} from "~/routes/menu/menu.validation";
import { getSession } from "~/routes/menu/menu.handler";
import MenuItem from "~/routes/menu/components/menu-item.component";

export default function MenuPage({
	params: { sessId },
}: {
	params: { sessId: string };
}) {
	const STORAGE_KEY = `menu:${sessId}`;
	const [menu, setMenu] = useState<ItemWithOpts[] | undefined>(undefined);
	const [cart, setCart] = useState<Cart | undefined>(undefined);
	const [numLineItems, setNumLineItems] = useState<number>(0);

	useEffect(() => {
		// Get item types
		getSession(sessId)
			.then((sess: SessionDetails) => {
				setMenu(sess.items);

				// TODO update items in cart to mirror potential changes on menu
				// i.e. price changes, options being removed, etc.
				const cartData = sessionStorage.getItem(STORAGE_KEY);
				// Parse empty string if data is null; "" will fail isCart test
				const parsedData = JSON.parse(cartData ?? "{}");

				const newCart = Cart.isCart(parsedData)
					? new Cart(parsedData)
					: new Cart();

				setCart(newCart);
				setNumLineItems(newCart.numLineItems);
			})
			.catch((err) => console.warn(err));

		const handleScroll = () => {
			const main = document.getElementById("order-page-main");
			const menuRect = document
				.getElementById("menu-container")
				?.getBoundingClientRect();

			if (!main || !menuRect) return;

			const scrollScale = Math.min(
				main.scrollTop / (menuRect.top + main.scrollTop),
				1,
			);

			const img = document.getElementById("order-page-img");
			if (img) {
				img.style.filter = `blur(${scrollScale * 20}px)`;
				img.style.scale = `${scrollScale / 10 + 1}`;
				img.style.opacity = `${(1 - scrollScale) * 100}%`;
			}
		};

		const main = document.getElementById("order-page-main");

		main?.addEventListener("scroll", handleScroll);

		return () => {
			main?.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const createPebbleEffect = (dropIn: boolean) => {
		const parent = document.getElementById("checkout-btn-container");
		if (parent) {
			const parentRect = parent.getBoundingClientRect();
			const pebble = document.createElement("div");
			pebble.style.zIndex = "-1";
			pebble.style.position = "absolute";
			pebble.style.background = "var(--color-accent)";
			pebble.style.borderRadius = "1000px";
			pebble.style.width = "30px";
			pebble.style.height = "30px";
			pebble.style.transform = "translateX(-50%)";
			pebble.style.left =
				(Math.random() * parentRect.width) / 2 + parentRect.width / 4 + "px";
			pebble.style.top = "-30px";

			if (dropIn) {
				pebble.classList.add("animate-dropIn");
			} else {
				pebble.classList.add("animate-dropOut");
			}
			parent.appendChild(pebble);

			setTimeout(() => {
				parent.removeChild(pebble);
			}, 1000);
		}
	};

	const handleUpdate = (item: CartItem, addItem: boolean = true) => {
		if (!cart || !menu) return;

		if (addItem) cart.addItem(item);
		else cart.removeItem(item);
		setNumLineItems(cart.numLineItems);

		// Update storage data
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart.toObject()));

		// Visuals
		createPebbleEffect(addItem);
	};

	return (
		<main
			id="order-page-main"
			className="no-scroll h-screen w-screen overflow-y-auto bg-primary"
		>
			<div className="fixed h-1/2 w-full bg-secondary lg:h-1/2">
				<img
					id="order-page-img"
					src="/test-menu-img.jpg"
					alt="restaurant"
					className="h-full w-full object-cover"
				/>
			</div>

			<Link
				to={`/checkout/${sessId}`}
				id="checkout-btn-container"
				className="gooey fixed bottom-10 left-10 z-[9999]"
				viewTransition
			>
				<button
					id="checkout-button"
					className="flex cursor-pointer flex-row gap-2 bg-accent px-6 py-4 font-bold transition-all duration-200 hover:text-secondary"
				>
					<ReceiptIcon className="icon-sm" />
					<span className="hidden md:block">Checkout</span>
					<span className={`${numLineItems <= 0 && "hidden"}`}>
						({numLineItems})
					</span>
				</button>
			</Link>

			<div className="relative flex h-full flex-col justify-end">
				{/* Menu */}
				<div
					id="menu-container"
					className="relative flex max-h-2/3 flex-col"
				>
					{/* Menu Header */}
					<div
						id="menu-header-container"
						className="flex flex-row items-end justify-end"
					>
						<div
							id="menu-header"
							className="relative right-0 h-[85px] w-1/2 bg-primary"
						>
							<h1 className="flex items-center justify-center font-dongle text-[64px] font-semibold text-accent">
								Menu
							</h1>
						</div>
					</div>
					{/* Menu Body */}
					<div
						id="menu-body"
						className="z-50 bg-primary p-[20px] shadow-lg sm:p-[30px] md:p-[50px] lg:p-[60px]"
					>
						<ul className="flex flex-col items-center gap-10">
							{menu &&
								menu.map((item, i) => (
									<Fragment key={i}>
										<MenuItem
											item={item}
											itemChildren={cart?.findItemFamily(item.id) ?? []}
											onUpdate={handleUpdate}
										/>
									</Fragment>
								))}
						</ul>
					</div>
				</div>
			</div>
		</main>
	);
}
