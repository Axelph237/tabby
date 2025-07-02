import { AnimatePresence, motion, type BoundingBox } from "motion/react";
import {
	Fragment,
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type ComponentProps,
	type JSX,
} from "react";
import type {
	Item,
	ItemWithOpts,
	Menu,
} from "~/routes/guest/menu/menu.validation";
import FullWidthDottedLine from "~/utils/components/full-width-dotted-line";
import {
	CaretRightIcon,
	ImgIcon,
	PenIcon,
	PlusIcon,
	SaveIcon,
	SendIcon,
	TabbyLogo,
} from "~/utils/components/icons";
import "./menu.css";
import { Link, useOutletContext } from "react-router";

export default function ExampleMenuPage() {
	const { context } = useOutletContext() as { context: { menu: Menu } };

	const [items, setItems] = useState<ItemWithOpts[]>([]);
	const [menuBBox, setMenuBBox] = useState<DOMRectReadOnly | undefined>(
		undefined,
	);
	const menuRef = useRef<HTMLDivElement>(null);
	const itemsRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		fetch(`/api/items?${new URLSearchParams({ menuId: context.menu.id })}`)
			.then((res) => {
				if (res.status === 200) return res.json();

				return undefined;
			})
			.then((data: ItemWithOpts[]) => setItems(data))
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		const box = menuRef.current?.getBoundingClientRect();
		console.log("New menu rect:", box?.toJSON());
		setMenuBBox(box);
	}, [items]);

	const handleCreateItem = () => {
		console.log("You clicked me!");

		const blankItem: ItemWithOpts = {
			id: -1,
			name: "Untitled Item",
			description: "description",
			basePrice: 0,
			imgUrl: null,
			options: [],
			createdAt: null,
			updatedAt: null,
			deletedAt: null,
		};

		setItems([...items, blankItem]);
	};

	return (
		<motion.div
			initial={{ top: "100%" }}
			animate={{ top: "0%" }}
			exit={{ top: `calc(${menuBBox?.height}px + 250px)` }}
			transition={{ duration: 0.2 }}
			className="relative flex h-full w-2/3 flex-col justify-end"
		>
			{/* Menu */}
			<div
				id="display-menu-container"
				className="relative flex max-h-2/3 flex-col"
			>
				{/* Menu Header */}
				<div
					id="display-menu-header-container"
					className="flex flex-row items-end justify-end"
				>
					<div
						id="display-menu-header"
						className="relative right-0 h-[85px] w-1/2 bg-primary"
					>
						<h1 className="flex items-center justify-center font-dongle text-[64px] font-semibold text-accent">
							Menu
						</h1>
					</div>
				</div>
				{/* Menu Body */}
				<div
					id="display-menu-body"
					ref={menuRef}
					className="z-50 flex flex-col gap-6 bg-primary p-[20px] sm:p-[30px] md:p-[50px] lg:p-[60px]"
				>
					<ul
						className="flex flex-col items-center gap-6"
						ref={itemsRef}
					>
						<AnimatePresence>
							{items &&
								items.map((item, i) => (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: 0.1 }}
										className="size-full"
										key={i}
									>
										<ExampleMenuItem item={item} />
									</motion.div>
								))}
						</AnimatePresence>
					</ul>
					<button
						className="btn w-full opacity-60 transition-all duration-150 hover:opacity-100"
						onClick={handleCreateItem}
					>
						<PlusIcon className="icon-md" />
					</button>
				</div>
			</div>
		</motion.div>
	);
}

function ExampleMenuItem({ item }: { item: ItemWithOpts }) {
	return (
		<div className="item-container relative flex h-[200px] w-full flex-row">
			{/* LEFT COLUMN */}
			<div className="flex h-full w-2/3 flex-col items-center justify-start">
				{/* Info Body */}
				<div
					className={`item-body size-full overflow-hidden bg-secondary p-[10px] transition-all duration-500`}
				>
					<h2
						id={`name-input-${item.id}`}
						className="font-dongle text-3xl break-normal outline-none sm:text-4xl lg:text-5xl"
					>
						{item.name}
					</h2>
					<p
						id={`desc-input-${item.id}`}
						className="text-md overflow-y-scroll font-medium break-normal opacity-60 outline-none sm:text-lg lg:text-xl"
					>
						{item.description}
					</p>
				</div>
			</div>

			{/* RIGHT COLUMN */}
			<div className="flex h-full w-1/3 flex-col items-center justify-start">
				{/* Img */}
				<div
					className={`item-img-container relative flex h-3/4 w-full items-center justify-center bg-secondary p-[10px] transition-all duration-500`}
				>
					{item.imgUrl ? (
						<img
							className="item-img size-full rounded-xl object-cover"
							src={item.imgUrl}
							alt={item.name}
						/>
					) : (
						<div
							className="item-img flex size-full cursor-pointer items-center justify-center rounded-xl bg-accent opacity-60"
							id={`img-input-${item.id}`}
						>
							<ImgIcon className="color-primary icon-md opacity-100" />
						</div>
					)}
				</div>

				{/* Buttons */}
				<div className="flex h-1/4 w-full items-start justify-center justify-evenly p-[5px] md:justify-center md:gap-[20px]">
					<Link
						to={`../item/${item.id}`}
						className="btn size-full text-sm opacity-60 transition-all duration-150 hover:scale-105 hover:opacity-100 sm:text-lg"
					>
						<PenIcon className="icon-sm" />
					</Link>
				</div>
			</div>
		</div>
	);
}
