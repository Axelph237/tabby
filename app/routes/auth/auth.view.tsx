import "/public/styles/menu.css";
import { Outlet } from "react-router";
import { TabbyLogo } from "~/components/icons";

export default function AuthPage() {
	return (
		<main
			id="order-page-main"
			className="relative flex h-screen w-screen flex-col justify-end overflow-hidden px-[20px]"
		>
			<div
				id="checkout-header"
				className="top-0 z-10 flex w-full flex-row items-center justify-between text-primary"
			>
				<h1 className="font-dongle text-[64px]">Tabby</h1>
				<TabbyLogo className="h-26 w-26" />
			</div>
			{/* Menu */}
			<div
				id="menu-container"
				className="gooey relative top-[30px] flex h-full flex-col"
			>
				<div className="flex flex-row items-end justify-end">
					<div className="relative right-0 w-1/2 bg-primary">
						<h1 className="flex items-center justify-center font-dongle text-[64px] font-semibold text-accent">
							Login
						</h1>
					</div>
				</div>
				<div className="z-50 flex h-full flex-col items-center justify-start bg-primary p-[20px] shadow-lg sm:p-[30px] md:p-[50px] lg:p-[60px]">
					{/*	Input */}
					<Outlet />
				</div>
			</div>
		</main>
	);
}
