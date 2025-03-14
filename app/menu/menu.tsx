import "./menu.css";
import { Fragment, type HTMLProps, useEffect, useRef, useState } from "react";

interface Item {
	name: string;
	img?: string;
	description?: string;
}

const testItems: Item[] = [
	{
		name: "Matcha Latte",
		img: "https://i.pinimg.com/736x/e9/a6/9b/e9a69b322c3fdec10b5448e4616095d3.jpg",
		description:
			"Ceremonial grade matcha whisked and served atop whole cow’s milk. House cold foam available on request.",
	},
	{
		name: "Gibraltar",
		img: "https://i.pinimg.com/736x/39/7f/80/397f8000561719de89e66f18a02f81d0.jpg",
		description:
			"Equal parts craft-brewed espresso and fresh cow’s milk. A gentle, fruity flavor with a creamy mouthfeel.",
	},
	{
		name: "Matcha Latte",
		img: "https://i.pinimg.com/736x/e9/a6/9b/e9a69b322c3fdec10b5448e4616095d3.jpg",
		description:
			"Ceremonial grade matcha whisked and served atop whole cow’s milk. House cold foam available on request.",
	},
	{
		name: "Gibraltar",
		img: "https://i.pinimg.com/736x/39/7f/80/397f8000561719de89e66f18a02f81d0.jpg",
		description:
			"Equal parts craft-brewed espresso and fresh cow’s milk. A gentle, fruity flavor with a creamy mouthfeel.",
	},
];

export default function Menu() {
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

	return (
		<main
			id="order-page-main"
			className="no-scroll h-screen w-screen overflow-y-auto"
		>
			<div className="fixed h-1/3 w-full lg:h-1/2">
				<img
					id="order-page-img"
					src="public/test-menu-img.jpg"
					alt="restaurant"
					className="h-full w-full object-cover"
				/>
			</div>

			<div className="flex h-full flex-col justify-end px-[15px]">
				{/* Menu */}
				<div
					id="menu-container"
					className="gooey relative flex max-h-4/5 animate-beckon flex-col md:max-h-3/4 lg:max-h-2/3"
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
							{testItems.map((item, i) => (
								<Fragment key={i}>
									<MenuItem item={item} />
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
	item: Item;
}

function MenuItem(props: MenuItemProps) {
	const [clicked, setClicked] = useState(false);
	const inputRef = useRef(null);

	const handleAdd = () => {
		if (!clicked) setClicked(true);

		if (!inputRef.current) return;

		const input = inputRef.current as HTMLInputElement;
		input.value = String(Number(input.value) + 1);
	};

	const handleSub = () => {
		if (
			!inputRef.current ||
			Number((inputRef.current as HTMLInputElement).value) <= 0
		)
			return;

		const input = inputRef.current as HTMLInputElement;
		input.value = String(Number(input.value) - 1);
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
					{props.item.img && (
						<img
							className="h-full w-full object-cover"
							src={props.item.img}
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
							<input
								value="0"
								type="number"
								className="h-full w-[50px] rounded-xl bg-accent text-center font-red-hat-text font-bold"
								ref={inputRef}
							/>
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
