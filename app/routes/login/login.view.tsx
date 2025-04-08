const loginUrl = "http://localhost:3000/auth/google";

export default function LoginPage() {
	return (
		<div>
			<a
				className="btn"
				href={loginUrl}
			>
				Login
			</a>
		</div>
	);
}
