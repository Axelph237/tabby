import "/app/routes/guest/menu/menu.css";
import { Fragment, type HTMLProps, useEffect, useState } from "react";
import { ReceiptIcon } from "~/utils/components/icons";
import { Link } from "react-router";
// import Cart, { type CartItem } from "~/utils/cart";
import {
	type Menu,
	type ItemWithOpts,
	type SessionDetails,
} from "~/routes/guest/menu/menu.validation";
import MenuItem from "~/routes/guest/menu/components/menu-item.component";
import { motion, useScroll } from "framer-motion";
import Cart from "./cart";

export default function MenuPage({
	params: { sessId },
}: {
	params: { sessId: string };
}) {
	const { scrollYProgress } = useScroll();
	const STORAGE_KEY = `menu:${sessId}`;
	const [menu, setMenu] = useState<Menu | undefined>(undefined);
	const [items, setItems] = useState<ItemWithOpts[] | undefined>(undefined);
	const [cart, setCart] = useState<Cart | undefined>(undefined);
	const [numLineItems, setNumLineItems] = useState<number>(0);

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
				setMenu(sess.menu);

				// TODO update items in cart to mirror potential changes on menu
				// i.e. price changes, options being removed, etc.
				const cartData = sessionStorage.getItem(STORAGE_KEY);
				// Parse empty string if data is null; "" will fail isCart test

				const parsedData = JSON.parse(cartData ?? "{}");

				const newCart = new Cart(parsedData.items ? parsedData : undefined);
				console.log("Generated cart from storage:", newCart);
				setCart(newCart);
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

	useEffect(() => {
		if (!menu) return;

		fetch(`/api/items?${new URLSearchParams({ menuId: menu.id })}`, {
			method: "GET",
			credentials: "include",
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				return undefined;
			})
			.then((items: ItemWithOpts[]) => {
				setItems(items);
			});
	}, [menu]);

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

	const handleCartUpdate = (itemId: number, count: number) => {
		if (!cart || !items) return;

		cart.addItem(itemId, count);
		console.log(cart.toObject());

		// Update storage data
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart?.toObject()));

		// Visuals
		createPebbleEffect(count > 0);
	};

	return (
		<motion.div
			id="menu-page-container"
			className="relative h-screen w-screen"
			key="menu-page-container"
			exit={{ top: "-3000px", opacity: 0 }}
		>
			<div className="fixed h-1/2 w-full bg-secondary lg:h-1/2">
				{/*<motion.img*/}
				{/*	id="order-page-img"*/}
				{/*	src="/test-menu-img.jpg"*/}
				{/*	alt="restaurant"*/}
				{/*	className="h-full w-full object-cover"*/}
				{/*	style={{*/}
				{/*		scale: scrollYProgress*/}
				{/*	}}*/}
				{/*/>*/}
			</div>

			{numLineItems >= 1 && (
				<Link
					to={`/guest/checkout/${sessId}`}
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
			)}

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
						className="z-50 bg-primary p-[20px] sm:p-[30px] md:p-[50px] lg:p-[60px]"
					>
						<ul className="flex flex-col items-center gap-10">
							{items &&
								items.map((item, i) => (
									<Fragment key={i}>
										<MenuItem
											item={{ ...item, count: cart?.getItems()[item.id] ?? 0 }}
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
