import { useOutlet, type OutletProps } from "react-router";
import { useEffect, useState } from "react";

interface AnimatedOutletProps<T = any> extends OutletProps {
	context?: T;
}

export default function AnimatedOutlet<T = any>(props: AnimatedOutletProps<T>) {
	const o = useOutlet(props);
	const [outlet, setOutlet] = useState(o);

	return <>{outlet}</>;
}
