import type { ComponentProps } from "react";

interface LineProps extends ComponentProps<"svg"> {
	height?: number;
	line?: ComponentProps<"line">;
}

export default function FullWidthLine(props: LineProps) {
	const lineHeight = props.height || 30;

	return (
		<svg
			width={props.width || "100%"}
			height={lineHeight}
		>
			<line
				x1="0"
				y1={lineHeight / 2}
				x2="100%"
				y2={lineHeight / 2}
				stroke={props.line?.stroke || "var(--color-accent)"}
				strokeWidth={props.line?.strokeWidth || "1.5"}
			/>
		</svg>
	);
}
