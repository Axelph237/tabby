import { type HTMLProps, useEffect, useState } from "react";
import type { ItemWithOpts } from "~/routes/menu/menu.validation";
import type { CartItem } from "~/utils/cart";

interface MenuItemProps extends HTMLProps<HTMLDivElement> {
	item: ItemWithOpts;
	itemChildren: CartItem[];
	onUpdate: (item: CartItem, addItem: boolean) => void;
}

export default function MenuItem({
	item,
	itemChildren,
	onUpdate,
	...props
}: MenuItemProps) {
	const [count, setCount] = useState(itemChildren.length);
	const [clicked, setClicked] = useState(itemChildren.length > 0);

	const [opened, setOpened] = useState(false);
	const [options, setOptions] = useState(undefined);

	useEffect(() => {
		let initCount = 0;
		for (const item of itemChildren) initCount += item.count;

		setCount(initCount);
	}, []);

	useEffect(() => {
		if (opened && !options) {
			// On first open get option data for item.
		}
	}, [opened]);

	const updateItem = (addItem: boolean = true) => {
		if (!clicked && count == 0) {
			setClicked(true);
			setOpened(true);
		} else if (!addItem && count <= 1) {
			setClicked(false);
			setOpened(false);
		}

		if (!addItem && count <= 0) return;

		setCount(addItem ? count + 1 : count - 1);

		// Call parent function
		onUpdate(
			{
				// Inherited props
				id: item.id,
				name: item.name,
				description: item.description,
				img_url: item.img_url,
				// New props
				unit_price: item.base_price,
				count: 1,
				selections: [],
			},
			addItem,
		);
	};

	return (
		<div
			className="item-container relative flex h-[200px] w-full flex-row"
			{...props}
		>
			{/* LEFT COLUMN */}
			<div className="flex h-full w-2/3 flex-col items-center justify-start">
				{/* Info Body */}
				<div
					className={`item-body size-full bg-secondary p-[10px] transition-all duration-500`}
				>
					<h2 className="font-dongle text-3xl sm:text-4xl lg:text-5xl">
						{item.name}
					</h2>
					<p className="text-md font-medium opacity-60 sm:text-lg lg:text-xl">
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
					{item.img_url && (
						<img
							className="item-img size-full rounded-xl object-cover"
							src={item.img_url}
							alt={item.name}
						/>
					)}
				</div>

				{/* Buttons */}
				<div className="flex h-1/4 w-full items-start justify-center justify-evenly p-[5px] md:justify-center md:gap-[20px]">
					{
						<button
							className="btn size-full text-sm sm:text-lg"
							onClick={() => console.log("Add clicked")}
						>
							Add
						</button>
					}
				</div>
			</div>
		</div>
	);
}
