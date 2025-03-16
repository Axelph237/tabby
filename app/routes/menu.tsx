import "../../public/styles/menu.css";
import { Fragment, type HTMLProps, useEffect, useState } from "react";
import { ReceiptIcon } from "~/components/icons";
import ItemType, { type Item } from "~/lib/item";
import { getTestTypes, tItemTypes } from "~/lib/testTypes";
import { Link } from "react-router";

export default function MenuPage({ params }: { params: { menuId: string } }) {
	const [itemCount, setItemCount] = useState(0);

	useEffect(() => {
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

	const handleUpdate = (item: Item, count: number) => {
		setItemCount(itemCount + count);

		const menuId = params.menuId;
		const sessionData = sessionStorage.getItem(menuId);

		if (sessionData) {
			const cartData = JSON.parse(sessionData);
			sessionStorage.setItem(menuId, JSON.stringify([...cartData, item]));
		} else {
			sessionStorage.setItem(menuId, JSON.stringify([item]));
		}

		createPebbleEffect(itemCount + count > itemCount);
	};

	return (
		<main
			id="order-page-main"
			className="no-scroll h-screen w-screen overflow-y-auto"
		>
			<div className="fixed h-1/2 w-full lg:h-1/2">
				<img
					id="order-page-img"
					src="../../public/test-menu-img.jpg"
					alt="restaurant"
					className="h-full w-full object-cover"
				/>
			</div>

			<Link
				to={`/checkout/${params.menuId}`}
				id="checkout-btn-container"
				className="gooey fixed bottom-10 left-10 z-[9999]"
			>
				<button
					id="checkout-button"
					className="flex cursor-pointer flex-row gap-2 bg-accent px-6 py-4 font-bold"
				>
					<ReceiptIcon className="icon-sm" />
					<span className="hidden md:block">Checkout</span>
					<span className={`${itemCount <= 0 && "hidden"}`}>({itemCount})</span>
				</button>
			</Link>

			<div className="flex h-full flex-col justify-end px-[15px]">
				{/* Menu */}
				<div
					id="menu-container"
					className="gooey relative flex max-h-2/3 flex-col"
				>
					<div className="flex flex-row items-end justify-end">
						<div className="relative right-0 h-[85px] w-1/2 bg-primary">
							<h1 className="flex items-center justify-center font-dongle text-[64px] font-semibold text-accent">
								Menu
							</h1>
						</div>
					</div>
					<div className="z-50 bg-primary p-[20px] shadow-lg sm:p-[30px] md:p-[50px] lg:p-[60px]">
						<ul className="flex flex-col items-center gap-10">
							{getTestTypes(10).map((item, i) => (
								<Fragment key={i}>
									<MenuItem
										item={item}
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

interface MenuItemProps extends HTMLProps<HTMLDivElement> {
	item: ItemType;
	onUpdate: (item: Item, count: number) => void;
}

function MenuItem(props: MenuItemProps) {
	const [count, setCount] = useState(0);
	const [clicked, setClicked] = useState(false);

	const handleAdd = () => {
		if (!clicked) setClicked(true);

		setCount(count + 1);

		// Call parent function
		props.onUpdate(props.item.createItem([]), 1);
	};

	const handleSub = () => {
		if (count <= 0) return;

		setCount(count - 1);

		// Call parent function
		props.onUpdate(props.item.createItem([]), -1);
	};

	return (
		<div
			className="relative flex w-full justify-center"
			{...props}
		>
			{/* shape */}
			<div className="content-aware-shadow gooey absolute flex w-full flex-row">
				{/* shape - body */}
				<div className="h-[200px] w-2/3 bg-secondary"></div>
				{/* shape - info */}
				<div className="h-[150px] w-1/3 bg-secondary"></div>
			</div>
			{/* Sections */}
			<div className="relative flex h-[200px] w-full flex-row gap-[10px] p-[10px]">
				{/* Body */}
				<div className="flex h-full w-2/3 flex-col">
					<h2 className="font-dongle text-3xl sm:text-4xl lg:text-5xl">
						{props.item.name}
					</h2>
					<p className="opacity-60 sm:text-lg lg:text-xl">
						{props.item.description}
					</p>
				</div>

				{/* Img */}
				<div className="flex h-[130px] w-1/3 items-center justify-center overflow-hidden rounded-xl object-cover">
					{props.item.imgUrl && (
						<img
							className="h-full w-full object-cover"
							src={props.item.imgUrl}
							alt={props.item.name}
						/>
					)}
				</div>

				{/* Buttons */}
				<div className="absolute right-0 bottom-0 flex h-[50px] w-1/3 items-center justify-center justify-evenly p-[5px] md:justify-center md:gap-[20px]">
					{!clicked ? (
						<button
							className="btn size-full"
							onClick={handleAdd}
						>
							Add
						</button>
					) : (
						<>
							<button
								className="btn relative aspect-square h-full animate-slideIn-r"
								onClick={handleSub}
							>
								-
							</button>
							<div className="item-count-input flex h-full w-[50px] items-center justify-center rounded-xl bg-accent font-red-hat-text font-bold">
								{count}
							</div>
							<button
								className="btn relative aspect-square h-full animate-slideIn-l"
								onClick={handleAdd}
							>
								+
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
