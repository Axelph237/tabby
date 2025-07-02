import "./dashboard.css";
import { Fragment, useEffect, useState } from "react";
import type { Menu } from "~/routes/guest/menu/menu.validation";
import {
	PenIcon,
	PlusIcon,
	RightArrowIcon,
	TabbyLogo,
} from "~/utils/components/icons";
import FullWidthDottedLine from "~/utils/components/full-width-dotted-line";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "./dashboard.handler";
import { Link, Outlet, useOutletContext } from "react-router";

export async function clientLoader() {
	const res = await fetch("/api/menus", {
		credentials: "include",
	});

	if (res.ok) return res.json();

	return undefined;
}

export default function DashboardPage({
	loaderData,
}: {
	loaderData: Menu[] | undefined;
}) {
	const [menus, setMenus] = useState<Menu[] | undefined>(loaderData);
	const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
		undefined,
	);
	const [creatingMenu, setCreatingMenu] = useState(false);
	const context = useOutletContext();

	useEffect(() => {
		if (menus && menus.length > 0) setSelectedIndex(0);
	}, [menus]);

	const handleClickArrow = (shift: number) => {
		if (!menus || menus.length === 0 || shift === 0) return;

		const newIndex =
			shift > 0
				? Math.min(menus.length - 1, (selectedIndex ?? 0) + shift)
				: Math.max(0, (selectedIndex ?? 0) + shift);

		setSelectedIndex(newIndex);
	};

	const handleClickCreateMenu = () => {
		Dashboard.createMenu({
			name: "Untitled Menu",
		})
			.then((menu: Menu) => {
				setMenus(menus ? [...menus, menu] : [menu]);
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="no-scroll flex h-screen flex-col">
			<header className="z-[9999] flex h-[100px] w-screen flex-row items-center justify-between bg-accent p-6">
				{/* Header Label */}
				<AnimatePresence mode="wait">
					{menus && menus.length > 0 && (
						<motion.h1
							key={selectedIndex}
							className="relative font-red-hat-display text-5xl font-bold"
							initial={{ left: "-500px", opacity: 0 }}
							animate={{
								left: "0",
								opacity: 1,
								transition: { ease: "easeInOut" },
							}}
							exit={{ left: "-500px", opacity: 0 }}
						>
							{menus[selectedIndex ?? 0].name}
						</motion.h1>
					)}
				</AnimatePresence>

				{/* Selection Dots */}
				<div className="flex flex-row gap-2">
					{menus &&
						menus.map((menu, i) => (
							<Fragment key={i}>
								<div
									className={`${selectedIndex === i ? "aspect-[2/1]" : "aspect-square cursor-pointer hover:opacity-75"} h-6 rounded-full bg-primary transition-all duration-150`}
									onClick={() => {
										setSelectedIndex(i);
									}}
								></div>
							</Fragment>
						))}
				</div>
			</header>
			<main
				id="dashboard-main"
				className="relative flex h-full w-screen flex-row overflow-hidden text-accent"
			>
				{/* Background Image */}
				<div className="absolute flex h-full w-full items-center justify-center blur-md">
					<img
						className="cover w-full opacity-50"
						src="https://i.pinimg.com/736x/17/96/6b/17966ba92598ac3974de4e2030246cb7.jpg"
						alt="bg-img"
					/>
				</div>

				{/* Tickets */}
				<div className="flex h-full w-32 items-center justify-center opacity-99">
					<RightArrowIcon
						className={`${(selectedIndex === 0 || !selectedIndex) && "hidden"} icon-lg rotate-180 cursor-pointer text-primary transition-all duration-200 hover:scale-120 hover:text-primary-dark`}
						onClick={() => handleClickArrow(-1)}
					/>
				</div>
				<div className="w-full">
					<AnimatePresence mode="wait">
						{/* All tickets made into individual elements for AnimatedPresence to track */}
						{menus && menus.length > 0 && (
							<motion.div
								key={selectedIndex}
								className="relative z-[999] mx-10 mb-10 flex h-fit w-[350px] flex-col items-center rounded-br-2xl rounded-bl-2xl bg-primary px-6 pb-6 font-red-hat-mono text-xl"
								initial={{ left: "100%" }}
								animate={{ left: "0", transition: { ease: "easeInOut" } }}
								exit={{ left: "-100%" }}
							>
								<h2 className="flex flex-row items-center font-dongle text-6xl">
									<TabbyLogo className="icon-2xl" /> Tabby
								</h2>
								<h2>{menus[selectedIndex ?? 0].name}</h2>
								<p className="text-sm opacity-75">Last edited (some time)</p>

								<FullWidthDottedLine
									line={{ strokeDasharray: "20", strokeWidth: "2" }}
								/>

								<Link
									className="flex cursor-pointer flex-row items-center gap-2 rounded-xl bg-secondary p-4 font-red-hat-text font-bold text-primary shadow-lg transition-all duration-200 hover:bg-secondary-dark"
									to={`edit/${menus[selectedIndex ?? 0].id}/menu`}
								>
									<PenIcon className="icon-sm" />
									Edit Menu
								</Link>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<div className="relative flex h-full w-32 items-center justify-center opacity-99">
					<RightArrowIcon
						className={`${menus && (menus.length === 0 || selectedIndex === menus.length - 1) && "hidden"} icon-lg cursor-pointer text-primary transition-all duration-200 hover:scale-120 hover:text-primary-dark`}
						onClick={() => handleClickArrow(1)}
					/>

					<PlusIcon
						className={`${!menus || menus.length === 0 || (selectedIndex !== menus.length - 1 && "hidden")} icon-lg cursor-pointer text-primary transition-all duration-200 hover:scale-120 hover:text-primary-dark`}
						onClick={handleClickCreateMenu}
					/>
				</div>
				<Outlet />
			</main>
		</div>
	);
}
