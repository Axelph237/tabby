import "/app/routes/guest/menu/menu.css";
import { Fragment, type HTMLProps, useEffect, useState } from "react";
import { ReceiptIcon } from "~/lib/components/icons";
import { Link } from "react-router";
// import Cart, { type CartItem } from "~/utils/cart";
import {
	type Menu,
	type ItemWithOpts,
	type SessionDetails,
	type Item,
} from "~/routes/guest/menu/menu.validation";
import MenuItem from "~/routes/guest/menu/components/menu-item.component";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import Cart from "./cart";
import useCartModel, { type TLineItem } from "./useCartModel";

export default function MenuPage({
	params: { sessId },
}: {
	params: { sessId: string };
}) {
	const [menu, setMenu] = useState<Menu | undefined>(undefined);
	const [items, setItems] = useState<ItemWithOpts[] | undefined>(undefined);
	// const [cart, setCart] = useState<Cart | undefined>(undefined);
	// const [numLineItems, setNumLineItems] = useState<number>(0);
	const cartModel = useCartModel({ sessId });

	// Load menu data on component mount, optimistic loading for guests
	useEffect(() => {
		// Get item types
		fetch(`/api/sessions/${sessId}`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(items),
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				throw new Error("Failed to find session.");
			})
			.then((sess: SessionDetails) => {
				console.log(sess);
				const { items, ...menu } = sess.menu;

				setMenu(menu);
				setItems(items);

				// const savedCart = Cart.get(STORAGE_KEY);
				// setCart(savedCart)
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

		const main = document.getElementById("guest-main");

		main?.addEventListener("scroll", handleScroll);

		return () => {
			main?.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// useEffect(() => {
	// 	if (!menu) return;

	// 	fetch(`/api/items?${new URLSearchParams({ menuId: menu.id })}`, {
	// 		method: "GET",
	// 		credentials: "include",
	// 	})
	// 		.then((res) => {
	// 			if (res.status === 200) return res.json();
	// 			return undefined;
	// 		})
	// 		.then((items: ItemWithOpts[]) => {
	// 			setItems(items);
	// 		});
	// }, [menu]);

	// Validate cart when items have been loaded
	// Ensures that items that have been removed from the menu are removed from the cart
	useEffect(() => {
		if (items) {
			cartModel.validateEntries(items);
		}
	}, [items]);

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

	/**
	 * Handles updates to the cart object. Including adding line items to the cart and executing animations.
	 * @param pi - The parent of the line item being added.
	 * @param li - The line item to add.
	 * @returns
	 */
	const handleCartUpdate = (pi: Item, li: TLineItem) => {
		if (!items || li.count <= 0) return;

		console.log("Parent item", pi);
		console.log("Line item:", li);
		cartModel.createLineItem(pi, li);

		// Visuals
		createPebbleEffect(li.count > 0);
	};

	return (
		<motion.div
			id="menu-page-container"
			className="relative h-screen w-screen"
			key="menu-page-container"
			initial={{ top: "-3000px", opacity: 0 }}
			animate={{ top: "0px", opacity: 1 }}
			exit={{ top: "-3000px", opacity: 0 }}
		>
			<div className="fixed h-1/2 w-full bg-secondary lg:h-1/2">
				<motion.img
					id="order-page-img"
					src={menu?.style?.backgroundImg}
					alt="restaurant"
					className="h-full w-full object-cover"
				/>
			</div>

			<Link
				to={`/guest/checkout/${sessId}`}
				id="checkout-btn-container"
				className={`${cartModel.getNumLineItems() < 1 && "pointer-events-none"} gooey fixed bottom-10 left-10 z-[9999] min-w-[100px] md:min-w-[200px]`}
				viewTransition
			>
				{cartModel.getNumLineItems() >= 1 && (
					<motion.button
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.1, ease: "easeInOut" }}
						id="checkout-button"
						className="relative flex w-full cursor-pointer flex-row gap-2 bg-accent px-6 py-4 font-bold transition-all duration-200 hover:text-secondary"
					>
						<ReceiptIcon className="icon-sm" />
						<span className="hidden md:block">Checkout</span>
						<span>({cartModel.getNumLineItems()})</span>
					</motion.button>
				)}
			</Link>

			<div
				id="menu-scroll-container"
				className="relative flex h-full flex-col justify-end"
			>
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
						className="z-50 bg-primary p-[20px] sm:p-[30px] md:p-[50px] lg:p-[60px]"
					>
						<ul className="flex flex-col items-center gap-10">
							{items &&
								items.map((item, i) => (
									<Fragment key={i}>
										<MenuItem
											item={item}
											count={
												(cartModel.items &&
													cartModel.items[item.id]?.totalCount) ??
												0
											}
											updateCart={handleCartUpdate}
										/>
									</Fragment>
								))}
						</ul>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
