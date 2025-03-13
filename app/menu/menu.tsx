import "./menu.css";
import { Fragment, type HTMLProps, useEffect } from "react";

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

			<div className="flex h-full flex-col justify-end pr-[15px] pl-[15px]">
				{/* Menu */}
				<div
					id="menu-container"
					className="relative flex max-h-4/5 animate-beckon flex-col md:max-h-3/4 lg:max-h-2/3"
				>
					<div className="flex flex-row items-end justify-end">
						{/*<div className="relative bg-accent w-1/2 h-[85px] rounded-tl-2xl rounded-tr-2xl">*/}
						{/*    <div className="absolute bottom-0 right-0 tl-corner w-[30px] h-[30px] bg-primary"></div>*/}
						{/*</div>*/}
						<div className="tl-corner h-[16px] w-[16px] bg-primary"></div>
						<div className="relative right-0 h-[85px] w-1/2 rounded-tl-2xl rounded-tr-2xl bg-primary">
							<h1 className="flex items-center justify-center font-dongle text-[64px] font-semibold text-accent">
								Menu
							</h1>
						</div>
					</div>
					<div className="z-50 rounded-tl-2xl rounded-br-2xl rounded-bl-2xl bg-primary p-[20px] shadow-lg sm:p-[30px] md:p-[50px] lg:p-[60px]">
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
	return (
		<div
			className="relative flex w-full justify-center"
			{...props}
		>
			{/* shape */}
			<div className="absolute flex w-full flex-row">
				{/* shape - body */}
				<div className="h-[200px] w-2/3 rounded-tl-2xl rounded-br-2xl rounded-bl-2xl bg-secondary"></div>
				{/* shape - info */}
				<div className="flex w-1/3 flex-col">
					<div className="h-[150px] w-full rounded-tr-2xl rounded-br-2xl bg-secondary"></div>
					<div className="br-corner h-[16px] w-[16px] bg-secondary"></div>
				</div>
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
				<div className="absolute right-0 bottom-0 flex h-[50px] w-1/3 items-center justify-center p-[5px]">
					<div className="flex size-full cursor-pointer items-center justify-center rounded-xl bg-accent font-bold">
						Add
					</div>
				</div>
			</div>
		</div>
	);
}
