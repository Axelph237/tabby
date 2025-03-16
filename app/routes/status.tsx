import { BurgerIcon, FireIcon, SendIcon, TabbyLogo } from "~/components/icons";

export default function QueuePage() {
	return (
		<main className="h-screen">
			<div className="flex h-full flex-col">
				{/* top */}
				<div className="h-1/3 px-[20px]">
					{/* header */}
					<div
						id="status-header"
						className="top-0 z-10 flex w-full flex-row items-center justify-between text-primary"
					>
						<h1 className="font-dongle text-[64px]">Tabby</h1>
						<TabbyLogo className="h-26 w-26" />
					</div>
				</div>
				{/* body */}
				<div className="relative flex h-2/3 flex-col items-center justify-center gap-[50px] bg-primary p-[20px]">
					<h1 className="text-center font-red-hat-display text-[40px] font-bold text-wrap text-secondary">
						Your Order Has Been Placed
					</h1>

					{/* progress bar */}
					<div className="flex flex-row items-center px-[30px]">
						{/* icons */}
						<div
							className={`${true ? "border-transparent bg-secondary" : "border-secondary bg-primary text-secondary"} relative col-start-1 row-start-1 flex aspect-square h-[48px] items-center justify-center rounded-full border-4`}
						>
							<SendIcon className="icon-sm" />
							<h2 className="absolute top-[115%] text-[20px] font-semibold text-secondary">
								Confirmed
							</h2>
						</div>

						<svg
							width="100%"
							height="50"
							className="col-start-1 col-end-1 row-start-1"
						>
							<line
								x1="0"
								y1="25"
								x2="100%"
								y2="25"
								stroke="var(--color-secondary)"
								stroke-width="4"
							/>
						</svg>

						<div
							className={`${false ? "border-transparent bg-secondary" : "border-secondary bg-primary text-secondary"} relative col-start-2 row-start-1 flex aspect-square h-[48px] items-center justify-center rounded-full border-4`}
						>
							<FireIcon className="icon-sm" />
							<h2 className="absolute top-[115%] text-[20px] font-semibold text-secondary">
								Preparing
							</h2>
						</div>

						<svg
							width="100%"
							height="50"
							className="col-start-2 col-end-2 row-start-1"
						>
							<line
								x1="0"
								y1="25"
								x2="100%"
								y2="25"
								stroke="var(--color-secondary)"
								stroke-width="4"
								stroke-dasharray="10,5"
							/>
						</svg>

						<div
							className={`${false ? "border-transparent bg-secondary" : "border-secondary bg-primary text-secondary"} relative col-start-3 row-start-1 flex aspect-square h-[48px] items-center justify-center rounded-full border-4`}
						>
							<BurgerIcon className="icon-sm" />
							<h2 className="absolute top-[115%] text-[20px] font-semibold text-secondary">
								Ready
							</h2>
						</div>
					</div>
				</div>
			</div>

			<div
				className="absolute top-1/3 left-[20px]"
				style={{ transform: "translateY(-32%)" }}
			>
				<svg
					width="233"
					height="171"
					viewBox="0 0 233 171"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M89.8108 54.6655H164.306C164.03 57.9764 164.306 66.0881 167.617 72.0477C168.288 73.2566 169.003 74.5091 169.738 75.7945C173.527 82.4305 177.818 89.9453 179.205 96.8793C180.471 103.211 179.8 110.511 179.415 114.704C179.296 115.993 179.205 116.989 179.205 117.572C179.205 120.883 185.5 124.194 188.31 124.194C191.119 124.194 192.614 123.532 196.587 120.883C200.56 118.235 207.071 96.0516 209.831 85.2912C211.21 92.4648 213.804 108.964 213.141 117.572C212.479 126.181 207.347 148.75 204.864 158.958C204.036 161.718 202.878 167.732 204.864 169.719C206.851 171.705 213 169.719 215.5 168.5C217.548 167.781 226.054 158.958 228.04 149.026C230.524 136.61 233.007 110.123 232.179 101.018C231.351 91.913 228.04 57.1487 218.935 47.216C209.83 37.2834 191.621 23.2121 160.167 19.0735C128.714 14.9349 113.815 16.5903 98.088 19.0735C85.5066 21.06 75.7395 23.2121 72.4286 24.0398C70.7732 22.1085 66.469 17.7491 62.496 15.7626C61.5387 13.529 60.9505 10.8034 60.3993 8.24956C59.5208 4.17872 58.7365 0.544531 56.7019 0.0358962C54.0532 -0.626281 47.3211 8.03721 44.2861 12.4517C38.7679 13.0035 26.5728 15.1004 21.9376 19.0735C12.8327 12.4517 3.72771 12.4517 2.07227 15.7626C0.747912 18.4113 3.72771 22.3844 5.38315 24.0398C4.27954 26.7989 2.73447 32.9793 5.38315 35.628C-0.970974 40.5584 -0.418966 49.9751 0.684664 54.6655H60.0127C61.944 60.4596 65.8067 74.0343 65.8067 81.9804V81.9805C65.8067 91.9132 65.8067 110.951 68.2899 115.089C70.2764 118.4 78.0047 118.42 81.5334 117.572C86 116.5 89.8108 91.913 89.8108 85.2912V54.6655ZM44.2811 28.6093C41.8281 29.4206 39.7684 30.7982 38.6608 31.7827C38.0416 32.3331 37.0935 32.2773 36.5431 31.6582C35.9927 31.039 36.0485 30.0909 36.6677 29.5405C38.0432 28.3178 40.4532 26.7155 43.339 25.7611C46.2341 24.8035 49.7455 24.4569 53.1724 25.98C53.9295 26.3165 54.2704 27.2029 53.9339 27.9599C53.5975 28.717 52.711 29.0579 51.954 28.7214C49.4213 27.5958 46.7248 27.801 44.2811 28.6093ZM18.026 35.0485C16.5158 35.7345 15.3691 36.7482 14.8126 37.4159C14.2823 38.0524 13.3364 38.1384 12.7 37.608C12.0636 37.0777 11.9776 36.1318 12.5079 35.4954C13.331 34.5077 14.833 33.2038 16.7854 32.3171C18.7595 31.4205 21.2679 30.9205 24.005 31.7025C24.8016 31.9301 25.2628 32.7603 25.0352 33.5569C24.8076 34.3534 23.9774 34.8147 23.1809 34.5871C21.2827 34.0447 19.5146 34.3724 18.026 35.0485ZM37.1001 36.2544C37.5008 36.6793 37.6184 37.2982 37.4015 37.8405L36.2205 40.793L39.2637 42.6189C39.9741 43.0452 40.2044 43.9666 39.7782 44.6769C39.352 45.3873 38.4306 45.6176 37.7202 45.1914L35.4068 43.8034L34.9965 45.8548C34.834 46.6671 34.0438 47.194 33.2314 47.0315C32.4191 46.869 31.8923 46.0788 32.0547 45.2665L32.6971 42.0548L30.1424 40.1389C29.6961 39.8041 29.4724 39.2493 29.5618 38.6986C29.6512 38.1479 30.0388 37.6923 30.5681 37.5158L35.5344 35.8604C36.0885 35.6757 36.6994 35.8294 37.1001 36.2544Z"
						fill="#353938"
					/>
				</svg>
			</div>
		</main>
	);
}
