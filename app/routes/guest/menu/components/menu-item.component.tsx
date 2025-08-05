import {
	AnimatePresence,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useScroll,
	type MotionAdvancedProps,
} from "motion/react";
import {
	type HTMLProps,
	useEffect,
	useState,
	type KeyboardEvent,
	type UIEvent,
	useRef,
	useLayoutEffect,
	type Ref,
} from "react";
import type { ItemWithOpts, Item } from "~/routes/guest/menu/menu.validation";
import type { TLineItem } from "../useCartModel";

interface MenuItemProps extends MotionAdvancedProps {
	item: ItemWithOpts;
	count: number;
	// Event caller for parent component that handles the cart itself changing
	updateCart: (pi: Item, li: TLineItem) => void;
}

export default function MenuItem({
	item,
	updateCart,
	...props
}: MenuItemProps) {
	// const [count, setCount] = useState<number>(item.count);
	// const [clicked, setClicked] = useState(item.count > 0);

	const [opened, setOpened] = useState(false);
	const [options, setOptions] = useState(undefined);

	const countInputRef = useRef<HTMLInputElement>(null);
	const notesInputRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (opened && !options) {
			// On first open get option data for item.
		}
	}, [opened]);

	// ---- Count input handlers
	const handleCountKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		// Masks user input to ensure that only numbers are actually typed
		if (
			Number.isInteger(Number(event.key)) ||
			event.key === "Backspace" ||
			event.key === "Delete"
		) {
			return event;
		} else {
			event.preventDefault();
			return false;
		}
	};

	const handleCountInput = () => {
		// Truncate leading zeros from input
		const input = countInputRef.current!;
		if (input.value.length > 1 && input.value[0] === "0") {
			input.value = input.value.slice(1, input.value.length);
		}
	};

	// ---- Spinner button handlers
	<AnimatePresence></AnimatePresence>;
	// Increments the input like default spinners, but is used on buttons external to the input
	const handleStepInput = (count: number) => {
		const input = countInputRef.current;
		if (!input) return;

		const inputNum = Number(input.value);
		if (Number.isInteger(inputNum)) {
			// Update input value
			const newVal = count + inputNum;
			input.value = String(newVal < 0 ? 0 : newVal);
			// Manually call count element input event
			handleCountInput();
		} else {
			console.error(
				"Numeric input field contains non-numeric values, or is not an integer.",
			);
		}
	};

	// ---- Customize button handlers
	const handleCustomizeClicked = () => {
		setOpened(true);
	};

	// ---- Add button handlers
	const handleAddClicked = () => {
		const input = countInputRef.current;
		if (!input) return;

		if (Number.isInteger(Number(input.value)) && Number(input.value) !== 0) {
			// ... Get options if count is above 0
			const newLineItem: TLineItem = {
				count: Number(input.value),
				selections: [],
				notes: undefined,
			};

			updateCart(item as Item, newLineItem);

			const commentsInput = document.getElementById(
				`comments-input-${item.id}`,
			);
			console.log("Comments:", commentsInput?.innerText);
		}

		setOpened(false);
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: 0.15 }}
			className="relative flex w-full flex-col"
			{...props}
		>
			{/* Main Item Display */}
			<div className="item-container">
				{/* LEFT COLUMN */}
				<div className="flex h-full w-2/3 flex-col items-center justify-start">
					{/* Info Body */}
					<AnimatePresence></AnimatePresence>
					<div className={`item-body transition-all duration-500`}>
						<div className="flex flex-row justify-between">
							<h2 className="font-dongle text-3xl sm:text-4xl lg:text-5xl">
								{item.name}
							</h2>
						</div>

						<PriceTag value={(item.basePrice / 100).toFixed(2)} />

						<p className="text-md font-medium opacity-60 sm:text-lg lg:text-xl">
							{item.description}
						</p>
					</div>
					{/* Item options */}
					<OptionContainer
						opened={opened}
						parentItemId={String(item.id)}
					/>
				</div>

				{/* RIGHT COLUMN */}
				<div className="flex h-full w-1/3 flex-col items-center justify-start">
					{/* Img */}
					<div className={`item-img-container transition-all duration-500`}>
						{item.imgUrl && (
							<img
								className="item-img size-full rounded-xl object-cover"
								src={item.imgUrl}
								alt={item.name}
							/>
						)}
					</div>

					{/* Buttons */}
					<div className="item-btn-container">
						<AnimatePresence mode="wait">
							{opened ? (
								<>
									<motion.div
										key={`button-row-1-${item.id}`}
										initial={{ top: "-100%", opacity: 0 }}
										animate={{ top: 0, opacity: 1 }}
										exit={{ top: "-100%", opacity: 0 }}
										className="relative flex size-full flex-row justify-evenly md:justify-center md:gap-[20px]"
									>
										<button
											onClick={() => handleStepInput(-1)}
											className="item-btn z-9999 size-full rounded-xl text-sm sm:text-lg"
										>
											-
										</button>
										<input
											ref={countInputRef}
											type="number"
											min="0"
											onKeyDown={handleCountKeyDown}
											onInput={handleCountInput}
											defaultValue={"0"}
											className="item-count-input z-9999 size-full rounded-xl text-center text-sm font-bold sm:text-lg"
										/>
										<button
											onClick={() => handleStepInput(1)}
											className="item-btn z-9999 size-full rounded-xl text-sm sm:text-lg"
										>
											+
										</button>
									</motion.div>
									<motion.button
										key={`button-row-2-${item.id}`}
										initial={{ top: "-100%", opacity: 0 }}
										animate={{ top: 0, opacity: 1 }}
										exit={{ top: "-100%", opacity: 0 }}
										className="item-btn relative z-9999 size-full w-full rounded-xl text-sm sm:text-lg"
										onClick={handleAddClicked}
									>
										Add to
									</motion.button>
								</>
							) : (
								<motion.button
									key={`button-customize-${item.id}`}
									initial={{ scale: 0, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ scale: 0, opacity: 0 }}
									className="item-btn item-btn relative z-9999 size-full rounded-xl text-sm sm:text-lg"
									onClick={handleCustomizeClicked}
								>
									Customize
								</motion.button>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function PriceTag({ value }: { value: string }) {
	return (
		<motion.div
			initial={{ rotate: 0 }}
			whileInView={{ rotate: "-15deg" }}
			transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
			className="item-price-tag-container"
		>
			<div className="item-price-tag text-md bg-primary font-red-hat-mono font-medium text-accent">
				${value}
			</div>
		</motion.div>
	);
}

function OptionContainer({
	opened,
	parentItemId,
}: {
	opened: boolean;
	parentItemId: string;
}) {
	return (
		<div
			className={`item-options-container ${opened && "opened"} h-fit w-full`}
		>
			<div className={`item-options ${opened && "opened"}`}>
				<label className="w-full sm:w-3/4">
					<span className="font-bold">Comments</span>
					<div
						contentEditable
						suppressContentEditableWarning
						id={`comments-input-${parentItemId}`}
						className="md:text-md min-h-[75px] w-full rounded-xl bg-primary p-2 font-red-hat-mono text-xs font-medium break-all text-accent outline-none sm:text-sm"
					/>
				</label>
			</div>
		</div>
	);
}

function OptionInput() {
	return <></>;
}
