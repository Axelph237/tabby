export default function Svgfilters() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			width="0"
			height="0"
			className="absolute"
		>
			<defs>
				<filter
					id="dropshadow"
					x="0"
					y="0"
					width="200%"
					height="200%"
				>
					<feDropShadow
						dx="1"
						dy="2"
						stdDeviation="1"
						result="shadow"
						floodOpacity="0.7"
					/>
				</filter>
				<filter id="goo">
					<feGaussianBlur
						in="SourceGraphic"
						stdDeviation="10"
						result="blur"
					/>
					<feColorMatrix
						in="blur"
						type="matrix"
						values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
						result="goo"
					/>
					<feComposite
						in="SourceGraphic"
						in2="goo"
						operator="atop"
					/>
				</filter>
			</defs>
		</svg>
	);
}
