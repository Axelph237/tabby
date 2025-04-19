import { useOutlet } from "react-router";
import { useState } from "react";

export default function AnimatedOutlet() {
	const o = useOutlet();
	const [outlet] = useState(o);

	return <>{outlet}</>;
}
