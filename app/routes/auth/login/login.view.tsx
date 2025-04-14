import { Fragment, type ReactNode, useEffect, useState } from "react";
import { GoogleLogoIcon, LockIcon, UserIcon } from "~/components/icons";
import "./login.css";
import { getMe } from "~/api/user.handler";

const providers = [
	{
		label: "Google",
		icon: <GoogleLogoIcon className="icon-sm" />,
		authLink: "http://localhost:3000/auth/google",
	},
];

export default function LoginPage() {
	const openPopup = (url: string) => {
		window.open(
			url,
			"_blank",
			`
			popup=true,
			width=${(window.innerWidth * 2) / 3},
			height=${(window.innerHeight * 2) / 3},
			left=${window.innerWidth / 6},
			top=${window.innerHeight / 6},
		`,
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<UserInput
				id="username"
				icon={<UserIcon className="icon-md" />}
				label={"Username"}
				placeholder={"Your user name"}
				className="font-dongle"
			/>
			<UserInput
				id="password"
				icon={<LockIcon className="icon-md" />}
				label={"Password"}
				placeholder={"password"}
				className="font-redacted-script"
				type="password"
			/>
			{/* Dividers */}
			<div className="flex flex-row items-center justify-center gap-2">
				<svg
					width="100%"
					height="4"
				>
					<line
						x1="0"
						y1="50%"
						x2="100%"
						y2="50%"
						stroke="var(--color-accent)"
						strokeWidth="2"
					/>
				</svg>
				<p className="text-lg font-bold whitespace-nowrap text-accent">
					Or with
				</p>
				<svg
					width="100%"
					height="4"
				>
					<line
						x1="0"
						y1="50%"
						x2="100%"
						y2="50%"
						stroke="var(--color-accent)"
						strokeWidth="2"
					/>
				</svg>
			</div>

			{/* Providers */}
			<ul className="flex flex-row items-center justify-center text-primary">
				{providers.map((provider, i) => (
					<Fragment key={i}>
						<button
							onClick={() => openPopup(provider.authLink)}
							className="w-fit cursor-pointer rounded-full bg-accent p-3 shadow-xl transition-all duration-200 hover:bg-secondary"
						>
							{provider.icon}
						</button>
					</Fragment>
				))}
			</ul>
		</div>
	);
}

interface UserInputProps {
	icon: ReactNode;
	label: string;
	placeholder: string;
	className?: string;
	type?: string;
	id: string;
}

function UserInput(props: UserInputProps) {
	return (
		<div
			id={props.id}
			className={`${props.className} user-input`}
		>
			<div>{props.icon}</div>
			<div className="flex w-full flex-col items-start justify-start">
				<label
					htmlFor={props.id + "-input"}
					className="text-md font-red-hat-display font-bold"
				>
					{props.label}
				</label>
				<input
					id={props.id + "-input"}
					className="w-full text-3xl outline-none"
					type={props.type ?? "text"}
					placeholder={props.placeholder}
				/>
			</div>
		</div>
	);
}
