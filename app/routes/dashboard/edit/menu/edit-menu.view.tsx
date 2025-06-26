import { AnimatePresence, motion } from "motion/react";
import {
	Fragment,
	useEffect,
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
	SendIcon,
	TabbyLogo,
} from "~/utils/components/icons";
import "./edit-menu.css";
import MenuItem from "~/routes/guest/menu/components/menu-item.component";

export async function clientLoader({ params }: { params: { menuId: string } }) {
	console.log("Menu id:", params.menuId);

	const response = await fetch(`/api/menus/${params.menuId}`, {
		method: "GET",
	});

	if (response.ok) {
		return await response.json();
	}
}

export default function EditMenuPage({
	loaderData,
}: {
	loaderData: Menu | undefined;
}) {
	if (!loaderData) return;

	const [menuData, setMenuData] = useState<Menu>(loaderData);

	const debounceFormEvent = (
		func: (formData: FormData) => void,
		delay: number,
	) => {
		let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
		return function (formChangeEvent: ChangeEvent<any>) {
			clearTimeout(timeout);
			const formData = new FormData(formChangeEvent.currentTarget);
			timeout = setTimeout(() => {
				func.apply(null, [formData]);
			}, delay);
		};
	};

	const validateForm = (formData: FormData) => {
		const menuUpdates: Partial<Menu> = {};

		// VALIDATION

		// Customer Checkout
		const checkoutMsg = formData.get("checkout-message") as string | null;
		if (checkoutMsg) menuUpdates.style = { ...menuUpdates.style, checkoutMsg };

		// Visuals
		const backgroundImg = formData.get("background-image") as string | null;
		const urlRegEx =
			/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
		if (backgroundImg && urlRegEx.test(backgroundImg))
			menuUpdates.style = { ...menuUpdates.style, backgroundImg };

		const primaryColor = formData.get("primary-color") as string | null;
		const secondaryColor = formData.get("secondary-color") as string | null;

		menuUpdates.style = {
			...menuUpdates.style,
			colors: {
				primary: primaryColor || undefined,
				secondary: secondaryColor || undefined,
			},
		};

		// Verify updates are valid
		if (!Object.is(menuUpdates, {}))
			handleFormSubmit(menuUpdates)
				.then((menu) => {
					setMenuData(menu);
				})
				.catch((err) => console.error(err));
	};

	const handleFormSubmit = async (body: Partial<Menu>): Promise<Menu> => {
		const res = await fetch(`/api/menus/${menuData.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
			credentials: "include",
		});

		if (res.status !== 200) throw new Error("Failed to submit form");

		return await res.json();
	};

	return (
		<main className="flex h-screen flex-row">
			{menuData?.style?.backgroundImg && (
				<div
					id="menu-bg-img-container"
					className="absolute top-0 left-0 h-screen w-screen object-cover"
				>
					<img
						src={menuData.style.backgroundImg}
						alt="menu-bg-img"
						id="menu-bg-img"
						className="h-full w-full object-cover opacity-75 blur-md"
					></img>
				</div>
			)}
			{/* Settings tab */}
			<div
				id="settings-menu"
				className="z-999 flex h-full w-full flex-col items-center justify-start overflow-hidden bg-primary p-4 opacity-100"
			>
				<h2 className="flex flex-row items-center font-dongle text-6xl text-accent">
					<TabbyLogo className="icon-2xl" />
					Tabby
				</h2>
				<h2 className="font-red-hat-mono text-2xl text-accent">
					{menuData.name}
				</h2>
				<p className="text-sm opacity-75">Last edited (some time)</p>

				<form
					onChange={debounceFormEvent(validateForm, 750)}
					id="setting-container"
					className="w-full overflow-scroll"
				>
					<SettingDropdown label="Analytics">
						<p>STUB</p>
					</SettingDropdown>

					<FullWidthDottedLine
						line={{ strokeDasharray: "20", strokeWidth: "2" }}
					/>

					<SettingDropdown label="Menu Hours">
						<p>STUB</p>
					</SettingDropdown>

					<FullWidthDottedLine
						line={{ strokeDasharray: "20", strokeWidth: "2" }}
					/>

					<SettingDropdown label="Customer Checkout">
						<SettingInput
							key={1}
							label="Checkout Message"
							type="text"
							name="checkout-message"
							defaultValue={menuData.style?.checkoutMsg || ""}
							placeholder="Enter a message to be displayed at checkout"
						/>
					</SettingDropdown>

					<FullWidthDottedLine
						line={{ strokeDasharray: "20", strokeWidth: "2" }}
					/>

					<SettingDropdown label="Visuals">
						<SettingInput
							key={1}
							label="Background Image"
							type="url"
							name="background-image"
							defaultValue={menuData.style?.backgroundImg || ""}
							placeholder="Enter an image url"
						/>
						<SettingInput
							key={2}
							label="Menu Colors"
						>
							<span className="flex flex-row gap-2">
								<label>
									<input
										className="rounded-full bg-transparent"
										type="color"
										name="primary-color"
										defaultValue={menuData.style?.colors?.primary || ""}
									/>
									<p className="font-medium opacity-60">Primary</p>
								</label>
								<label>
									<input
										className="appearance-none rounded-full"
										type="color"
										name="secondary-color"
										defaultValue={menuData.style?.colors?.secondary || ""}
									/>
									<p className="font-medium opacity-60">Secondary</p>
								</label>
							</span>
						</SettingInput>
					</SettingDropdown>

					<FullWidthDottedLine
						line={{ strokeDasharray: "20", strokeWidth: "2" }}
					/>
					<p>hello</p>
				</form>
			</div>
			{/* Items tab */}
			<div className="z-999 flex h-full w-full flex-row items-center justify-center overflow-scroll">
				<DisplayMenu menuId={menuData.id} />
			</div>
		</main>
	);
}

function SettingDropdown({
	label,
	children,
}: {
	label: string;
	children?: JSX.Element | JSX.Element[];
}) {
	const [opened, setOpened] = useState(false);

	return (
		<div className="flex min-h-[20px] w-full flex-col gap-3 text-accent">
			<span
				className="setting-dropdown-label flex cursor-pointer flex-row items-center gap-3"
				onClick={() => setOpened(!opened)}
			>
				<h2 className="font-red-hat-display text-2xl font-medium">{label}</h2>
				{
					<CaretRightIcon
						className={`icon-sm ${opened && "rotate-90"} transition-all duration-150`}
					/>
				}
			</span>
			<AnimatePresence mode="wait">
				<ul
					className={`flex flex-col gap-2 ${!opened && "hidden"}`}
					key={opened.toString()}
				>
					<AnimatePresence propagate>{children}</AnimatePresence>
				</ul>
			</AnimatePresence>
		</div>
	);
}

interface SettingInputProps extends ComponentProps<"input"> {
	label: string;
	key: number;
}

function SettingInput({ label, ...props }: SettingInputProps) {
	return (
		<motion.label
			initial={{ opacity: 0, left: "-100%" }}
			animate={{ opacity: 1, left: 0 }}
			key={props.key}
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
		</motion.label>
	);
}

function DisplayMenu({ menuId }: { menuId: string }) {
	const [items, setItems] = useState<ItemWithOpts[]>([]);

	useEffect(() => {
		fetch(`/api/items?${new URLSearchParams({ menuId })}`)
			.then((res) => {
				if (res.status === 200) return res.json();

				return undefined;
			})
			.then((data: ItemWithOpts[]) => setItems(data))
			.catch((err) => console.error(err));
	}, []);

	const handleCreateItem = () => {
		console.log("You clicked me!");

		const blankItem: ItemWithOpts = {
			id: -1,
			name: "Untitled Item",
			description: "description",
			basePrice: 0,
			imgUrl: null,
			options: [],
		};

		setItems([...items, blankItem]);
	};

	return (
		<div className="relative flex h-full w-2/3 flex-col justify-end">
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
					className="z-50 flex flex-col gap-6 bg-primary p-[20px] sm:p-[30px] md:p-[50px] lg:p-[60px]"
				>
					<ul className="flex flex-col items-center gap-6">
						{items &&
							items.map((item, i) => (
								<Fragment key={i}>
									<div className="item-container relative flex h-[200px] w-full flex-row">
										{/* LEFT COLUMN */}
										<div className="flex h-full w-2/3 flex-col items-center justify-start">
											{/* Info Body */}
											<div
												className={`item-body size-full overflow-hidden bg-secondary p-[10px] transition-all duration-500`}
											>
												<h2
													contentEditable
													suppressContentEditableWarning
													className="font-dongle text-3xl break-normal outline-none sm:text-4xl lg:text-5xl"
												>
													{item.name}
												</h2>
												<p
													contentEditable
													suppressContentEditableWarning
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
													<div className="item-img flex size-full cursor-pointer items-center justify-center rounded-xl bg-accent opacity-60 transition-all duration-150 hover:opacity-100">
														<ImgIcon className="color-primary icon-md opacity-100" />
													</div>
												)}
											</div>

											{/* Buttons */}
											<div className="flex h-1/4 w-full items-start justify-center justify-evenly p-[5px] md:justify-center md:gap-[20px]">
												{
													<button
														className="btn size-full text-sm opacity-60 transition-all duration-150 hover:opacity-100 sm:text-lg"
														onClick={() => console.log("Clicked")}
													>
														<SendIcon className="icon-sm" />
													</button>
												}
											</div>
										</div>
									</div>
								</Fragment>
							))}
					</ul>
					<button
						className="btn w-full opacity-60 transition-all duration-150 hover:opacity-100"
						onClick={handleCreateItem}
					>
						<PlusIcon className="icon-md" />
					</button>
				</div>
			</div>
		</div>
	);
}
