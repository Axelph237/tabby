import type { ItemWithOpts } from "~/routes/guest/menu/menu.validation";
import "./item.css";
import {
	useEffect,
	useRef,
	useState,
	type ComponentProps,
	type FormEvent,
} from "react";
import { motion } from "motion/react";
import { PenIcon, SaveIcon, TrashIcon } from "~/utils/components/icons";
import { Link, useNavigate } from "react-router";

const newItem: ItemWithOpts = {
	id: -1,
	name: "Untitled Item",
	description: undefined,
	imgUrl: undefined,
	basePrice: 0,
	createdAt: null,
	updatedAt: null,
	deletedAt: null,
	options: [],
};

export default function EditItemPage({
	params,
}: {
	params: { itemId: string };
}) {
	const isNewItem = params.itemId == "new";
	const navigate = useNavigate();
	const [item, setItem] = useState<ItemWithOpts | undefined>(undefined);
	const [saved, setSaved] = useState<boolean>(!isNewItem);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (isNewItem) {
			setItem(newItem);
		} else {
			fetch(`/api/items/${params.itemId}`, {
				method: "GET",
				credentials: "include",
			})
				.then((res) => {
					if (res.status === 200) return res.json();
					return undefined;
				})
				.then((data) => setItem(data ?? newItem))
				.catch((err) => console.error(err));
		}
	}, []);

	const handleInput = () => {
		console.log("input handled");
		setSaved(false);
	};

	const handleSave = (e: FormEvent) => {
		e.preventDefault();
		setSaved(true);

		const formData = new FormData(formRef.current!);
		const name = formData.get("item-name");
		const desc = formData.get("item-desc");
		const imgUrl = formData.get("item-imgUrl");
		const basePrice = Number(formData.get("item-basePrice") || 0);

		let updatedItem = {
			name,
			imgUrl,
			basePrice,
			description: desc,
		};

		fetch(`/api/items${isNewItem ? "" : `/${params.itemId}`}`, {
			method: isNewItem ? "POST" : "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedItem),
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				return undefined;
			})
			.then((data) => setItem(data))
			.catch((err) => {
				console.log(err);
				setSaved(false);
			});
	};

	const handleDelete = (e: FormEvent) => {
		e.preventDefault();

		fetch(`/api/items/${params.itemId}`, {
			method: "DELETE",
			credentials: "include",
		})
			.then((res) => {
				if (res.status === 200) return navigate("../menu");
				throw new Error("Failed to delete item.");
			})
			.catch((err) => console.error(err));
	};

	if (!item) return <></>;

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
				ref={formRef}
				className="flex flex-col gap-2 bg-primary p-4 text-accent"
			>
				<div className="flex flex-row items-center justify-between">
					<h1 className="flex items-center justify-center font-dongle text-[64px] font-semibold text-accent">
						Edit Item
					</h1>
					<Link
						to="../menu"
						className="btn h-fit px-4 py-2 text-primary"
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

				<div className="flex flex-row justify-between">
					{saved ? (
						<div className="w-fit justify-self-end rounded-xl bg-accent px-6 py-2 opacity-60">
							<SaveIcon className="icon-sm opacity-0" />
						</div>
					) : (
						<button
							onClick={handleSave}
							className="btn w-fit justify-self-end px-6 py-2 text-primary"
						>
							<SaveIcon className="icon-sm" />
						</button>
					)}
					{!isNewItem && (
						<button
							className="btn px-6 py-2 text-primary hover:text-red-300"
							onClick={handleDelete}
						>
							<TrashIcon className="icon-sm" />
						</button>
					)}
				</div>
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
