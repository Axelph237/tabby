import type { Item } from "~/routes/guest/menu/menu.validation";
import "./item.css";
import type { ComponentProps } from "react";
import { motion } from "motion/react";
import { PenIcon } from "~/utils/components/icons";
import { Link, useOutletContext } from "react-router";

const newItem: Item = {
	id: -1,
	name: "Untitled Item",
	description: undefined,
	imgUrl: undefined,
	basePrice: 0,
	createdAt: null,
	updatedAt: null,
	deletedAt: null,
};

export default function EditItemPage({
	params,
}: {
	params: { itemId: string };
}) {
	const { context } = useOutletContext() as {
		context: { items: Item[] | undefined };
	};

	const item =
		params.itemId == "new"
			? newItem
			: context.items?.find((v) => v.id == Number(params.itemId));

	if (!item) return <>Item not defined</>;

	const handleInput = () => {
		console.log("input handled");
	};

	return (
		<motion.div
			initial={{ top: "100%" }}
			animate={{ top: "0%" }}
			exit={{ top: "100%" }}
			transition={{ duration: 0.2 }}
			className="relative flex h-full w-2/3 flex-col justify-end"
		>
			<form
				id="edit-item-form"
				onInput={handleInput}
				className="flex flex-col gap-2 bg-primary p-4 text-accent"
			>
				<div className="flex flex-row items-center justify-between">
					<h1 className="flex items-center justify-center font-dongle text-[64px] font-semibold text-accent">
						Edit Item
					</h1>
					<Link
						to="../menu"
						className="btn h-fit px-4 py-2 text-primary opacity-60 hover:opacity-100"
					>
						Back
					</Link>
				</div>

				<ItemInput
					label="Name"
					type="text"
					name="item-name"
					defaultValue={item.name}
				/>

				<ItemInput
					label="Description"
					type="text"
					name="item-desc"
					defaultValue={item.description ?? ""}
				/>

				<ItemInput
					label="Example Image URL"
					type="text"
					name="item-imgUrl"
					defaultValue={item.imgUrl ?? ""}
				/>

				<ItemInput
					label="Base Price"
					type="number"
					name="item-basePrice"
					defaultValue={item.basePrice}
				/>
			</form>
		</motion.div>
	);
}

interface ItemInputProps extends ComponentProps<"input"> {
	label: string;
}

function ItemInput({ label, ...props }: ItemInputProps) {
	return (
		<label
			// initial={{ scale: 0, opacity: 0 }}
			// animate={{ scale: 1, opacity: 1 }}
			className="relative flex flex-col rounded-xl bg-secondary p-2 text-primary"
		>
			<span className="flex items-center gap-2 font-dongle text-3xl">
				<b>{label}</b> <PenIcon className="icon-xs opacity-60" />
			</span>
			{props.children || (
				<input
					className="font-medium opacity-60 outline-none"
					{...props}
				/>
			)}
		</label>
	);
}
