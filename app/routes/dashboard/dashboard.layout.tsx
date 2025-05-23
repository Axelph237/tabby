import "./dashboard.css";
import { Fragment, useEffect, useState } from "react";
import type { Menu } from "~/routes/guest/menu/menu.validation";
import { PenIcon, TabbyLogo } from "~/components/icons";
import FullWidthDottedLine from "~/components/fullWidthDottedLine";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout() {
	const [menus, setMenus] = useState<Menu[] | undefined>(undefined);
	const [selectedMenu, setSelectedMenu] = useState<Menu | undefined>(undefined);

	useEffect(() => {
		fetch("http://localhost:3000/menus", {
			credentials: "include",
		})
			.then((res) => {
				if (res.ok) return res.json();
			})
			.then(setMenus)
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		if (menus) setSelectedMenu(menus[0]);

		console.log("Menus", menus);
	}, [menus]);

	const handleClickEdit = () => {
		// STUB
		console.log("Edit clicked");
	};

	return (
		<div className="no-scroll flex h-screen flex-col">
			<header className="z-[9999] flex h-[100px] w-screen flex-row items-center justify-between bg-accent p-6">
				{/* Header Label */}
				<AnimatePresence mode="wait">
					{menus &&
						menus.map(
							(menu, i) =>
								selectedMenu === menu && (
									<motion.h1
										className="relative font-red-hat-display text-5xl font-bold"
										key={i}
										initial={{ left: "-500px", opacity: 0 }}
										animate={{
											left: "0",
											opacity: 1,
											transition: { ease: "easeInOut" },
										}}
										exit={{ left: "-500px", opacity: 0 }}
									>
										{selectedMenu?.name}
									</motion.h1>
								),
						)}
				</AnimatePresence>

				<div className="flex flex-row gap-2">
					{menus &&
						menus.map((menu, i) => (
							<Fragment key={i}>
								<div
									className={`${selectedMenu === menu ? "aspect-[2/1]" : "aspect-square cursor-pointer hover:opacity-75"} h-6 rounded-full bg-primary transition-all duration-150`}
									onClick={() => setSelectedMenu(menu)}
								></div>
							</Fragment>
						))}
				</div>
			</header>
			<main
				id="dashboard-main"
				className="relative flex h-full w-screen flex-col overflow-hidden text-accent"
			>
				{/* Background Image */}
				<div className="absolute flex h-full w-full items-center justify-center opacity-50 blur-md">
					<img
						className="cover w-full"
						src="https://i.pinimg.com/736x/17/96/6b/17966ba92598ac3974de4e2030246cb7.jpg"
						alt="bg-img"
					/>
				</div>

				{/* Tickets */}
				<AnimatePresence mode="wait">
					{/* All tickets made into individual elements for AnimatedPresence to track */}
					{menus &&
						menus.map(
							(menu, i) =>
								selectedMenu === menu && (
									<motion.div
										key={i}
										className="relative z-[999] mx-10 mb-10 flex h-fit w-[350px] flex-col items-center rounded-br-2xl rounded-bl-2xl bg-primary px-6 pb-6 font-red-hat-mono text-xl"
										initial={{ left: "100%" }}
										animate={{ left: "0", transition: { ease: "easeInOut" } }}
										exit={{ left: "-100%" }}
									>
										<h2 className="flex flex-row items-center font-dongle text-6xl">
											<TabbyLogo className="icon-2xl" /> Tabby
										</h2>
										<h2>{menu.name}</h2>
										<p className="text-sm opacity-75">
											Last edited (some time)
										</p>

										<FullWidthDottedLine
											line={{ strokeDasharray: "20", strokeWidth: "2" }}
										/>

										<button
											className="flex cursor-pointer flex-row items-center gap-2 rounded-xl bg-secondary p-4 font-red-hat-text font-bold text-primary shadow-lg transition-all duration-200 hover:bg-secondary-dark"
											onClick={handleClickEdit}
										>
											<PenIcon className="icon-sm" />
											Edit Menu
										</button>
									</motion.div>
								),
						)}
				</AnimatePresence>
			</main>
		</div>
	);
}
