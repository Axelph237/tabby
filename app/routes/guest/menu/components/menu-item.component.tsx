import { motion, type MotionAdvancedProps } from "motion/react";
import { type HTMLProps, useEffect, useState } from "react";
import type { ItemWithOpts } from "~/routes/guest/menu/menu.validation";
import type { CartItem } from "~/utils/cart";

interface MenuItemProps extends MotionAdvancedProps {
	item: ItemWithOpts & { count: number };
	updateCart: (itemId: number, count: number) => void;
}

export default function MenuItem({
	item,
	updateCart,
	...props
}: MenuItemProps) {
	const [count, setCount] = useState(item.count);
	const [clicked, setClicked] = useState(item.count > 0);

	const [opened, setOpened] = useState(false);
	const [options, setOptions] = useState(undefined);

	useEffect(() => {
		if (opened && !options) {
			// On first open get option data for item.
		}
	}, [opened]);

	const addItem = (n: number = 1) => {
		if (!clicked && count == 0) {
			setClicked(true);
			setOpened(true);
		} else if (n <= 0 && count <= 1) {
			setClicked(false);
			setOpened(false);
		}

		if (n <= 0 && count <= 0) return;

		updateCart(item.id, n);
		setCount(count + n);
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
					{item.imgUrl && (
						<img
							className="item-img size-full rounded-xl object-cover"
							src={item.imgUrl}
							alt={item.name}
						/>
					)}
				</div>

				{/* Buttons */}
				<div className="flex h-1/4 w-full items-start justify-center justify-evenly p-[5px] md:justify-center md:gap-[20px]">
					{
						<button
							className="btn z-9999 size-full text-sm sm:text-lg"
							onClick={() => addItem(1)}
						>
							Add
						</button>
					}
				</div>
			</div>
		</div>
	);
}
