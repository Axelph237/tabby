import { AnimatePresence, motion } from "motion/react";
import {
	useState,
	type ChangeEvent,
	type ComponentProps,
	type JSX,
} from "react";
import type { Menu } from "~/routes/guest/menu/menu.validation";
import FullWidthDottedLine from "~/utils/components/full-width-dotted-line";
import { CaretRightIcon, PenIcon, TabbyLogo } from "~/utils/components/icons";

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
		<main className="flex h-screen flex-row p-4">
			{menuData?.style?.backgroundImg && (
				<div
					id="menu-bg-img-container"
					className="absolute top-0 left-0 w-screen object-cover"
				>
					<img
						src={menuData.style.backgroundImg}
						alt="menu-bg-img"
						id="menu-bg-img"
						className="w-full object-cover opacity-75 blur-md"
					></img>
				</div>
			)}
			{/* Settings tab */}
			<div className="z-999 flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-lg bg-primary p-4 opacity-100">
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
				</form>
			</div>
			{/* Items tab */}
			<div className="h-full w-full"></div>
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
