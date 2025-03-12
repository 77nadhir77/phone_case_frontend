import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";

const PhonePreview = ({
	cropedImageUrl,
	color,
}: {
	cropedImageUrl: string;
	color: string;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [renderedDimensions, setRenderedDimensions] = useState({
		width: 0,
		height: 0,
	});

	const handleResize = () => {
		if (!ref.current) return;

		const { width, height } = ref.current.getBoundingClientRect();

		setRenderedDimensions({ width, height });
	};

	useEffect(() => {
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	},[]);

	let caseBackgroundColor = "bg-zinc-950";
	if (color === "Blue") caseBackgroundColor = "bg-blue-950";
	if (color === "Rose") caseBackgroundColor = "bg-rose-950";

	return (
		<AspectRatio ratio={3000 / 2001} ref={ref} className="relative">
			<div
				className="absolute z-20 scale-[1.0352]"
				style={{
					left:
						renderedDimensions.width / 2 -
						renderedDimensions.width / (1216 / 121),
					top: renderedDimensions.height / 6.22,
				}}
			>
				<img
					width={renderedDimensions.width / (3000 / 637)}
					src={cropedImageUrl}
					alt=""
					className={cn(
						"phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-b-[30px] md:rounded-t-[20px]",
						caseBackgroundColor
					)}
				/>
			</div>

			<div className="relative h-full w-full z-40">
				<img
					alt="clear phone"
					src="/clearphone.png"
					className="pointer-events-none h-full w-full antialiased rounded-md"
				/>
			</div>
		</AspectRatio>
	);
};

export default PhonePreview;
