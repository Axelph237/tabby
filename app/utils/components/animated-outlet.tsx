import { useOutlet, type OutletProps } from "react-router";
import { useState } from "react";

export default function AnimatedOutlet(props: OutletProps) {
	const o = useOutlet(props);
	const [outlet] = useState(o);

	return <>{outlet}</>;
}
