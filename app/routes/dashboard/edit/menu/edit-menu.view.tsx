import { useState, type ComponentProps, type JSX } from "react";
import type { Menu } from "~/routes/guest/menu/menu.validation";
import FullWidthDottedLine from "~/utils/components/full-width-dotted-line";
import {
	CaretDownIcon,
	CaretRightIcon,
	PenIcon,
	TabbyLogo,
} from "~/utils/components/icons";

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
	console.log(loaderData);
	if (!loaderData) return;

	return (
		<main className="flex h-screen flex-row p-4">
			{loaderData?.style?.background_img && (
				<div
					id="menu-bg-img-container"
					className="absolute top-0 left-0 w-screen object-cover"
				>
					<img
						src={loaderData.style.background_img}
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
					{loaderData.name}
				</h2>
				<p className="text-sm opacity-75">Last edited (some time)</p>

				<div className="settings-container w-full">
					<SettingDropdown label="Analytics">
						<p>Hello</p>
						<p>Hello</p>
						<p>Hello</p>
						<p>Hello</p>
					</SettingDropdown>

					<FullWidthDottedLine
						line={{ strokeDasharray: "20", strokeWidth: "2" }}
					/>

					<SettingDropdown label="Menu Hours">
						<p>Hello</p>
						<p>Hello</p>
						<p>Hello</p>
						<p>Hello</p>
					</SettingDropdown>

					<FullWidthDottedLine
						line={{ strokeDasharray: "20", strokeWidth: "2" }}
					/>

					<SettingDropdown label="Customer Checkout">
						<p>Hello</p>
						<p>Hello</p>
						<p>Hello</p>
						<p>Hello</p>
					</SettingDropdown>

					<FullWidthDottedLine
						line={{ strokeDasharray: "20", strokeWidth: "2" }}
					/>

					<SettingDropdown label="Visuals">
						<SettingInput
							label="Background Image"
							defaultValue={loaderData.style?.background_img || ""}
						/>
					</SettingDropdown>

					<FullWidthDottedLine
						line={{ strokeDasharray: "20", strokeWidth: "2" }}
					/>
				</div>
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
		<form className="flex min-h-[20px] w-full flex-col gap-3 text-accent">
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
			<ul className={`${!opened && "hidden"}`}>{children}</ul>
		</form>
	);
}

interface SettingInputProps extends ComponentProps<"input"> {
	label: string;
}

function SettingInput({ label, ...props }: SettingInputProps) {
	return (
		<label className="flex flex-col rounded-xl bg-secondary p-2 text-primary">
			<span className="flex items-center gap-2 font-dongle text-3xl">
				<b>{label}</b> <PenIcon className="icon-xs opacity-60" />
			</span>
			<input
				className="font-medium opacity-60 outline-none"
				{...props}
			/>
		</label>
	);
}
