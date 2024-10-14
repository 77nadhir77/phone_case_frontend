import { useEffect, useState } from "react";
import Steps from "../../components/Steps";
import Confetti from "react-dom-confetti";
import Phone from "../../components/Phone";
import { useUploadContext } from "../../Context/UploadProvider";
import { COLORS, MODELS } from "../../Utils/option-validators";
import cn from "classnames";
import { ArrowRight, Check } from "lucide-react";
import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import {
	BASE_PRICE,
	priceFormater,
	PRODUCT_PRICES,
} from "../../config/products";
import { Button } from "../../components/Button";
import { Arrow } from "@radix-ui/react-dropdown-menu";

const Preview = () => {
	const [showConfetti, setShowConfetti] = useState(false);

	const { cropedImageUrl, phoneCase } = useUploadContext();

	useEffect(() => {
		setShowConfetti(true);
	}, []);

	const color = phoneCase?.color;
	const tw = COLORS.find((c) => c.label === color)?.tw;
	const modelLabel = MODELS.options.find(
		({ label }) => phoneCase?.model === label
	)!.label;

	return (
		<MaxWidthWrapper>
			<Steps />
			<div
				aria-hidden="true"
				className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
			>
				<Confetti
					active={showConfetti}
					config={{ elementCount: 200, spread: 90 }}
				/>
			</div>
			<div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
				<div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
					<Phone
						bg={tw}
						imgSrc={cropedImageUrl || "no image available"}
					/>
				</div>
				<div className="sm:col-span-12 md:col-span-9 text-base">
					<div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-9">
						<h3 className="text-3xl font-bold tracking-tight text-gray-900">
							Your {modelLabel} Case
						</h3>
						<div className="mt-3 flex items-center gap-1.5 text-base">
							<Check className="h-4 w-4 text-green-500" />
							In stock and ready to ship
						</div>
					</div>
					<div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
						<div>
							<p className="font-medium text-zinc-950">Highlights</p>
							<ol className="mt-3 list-disc list-inside text-zinc-700">
								<li>Wirless charging compatible</li>
								<li>shock absorption (IPX8)</li>
								<li>Water resistance (IP68)</li>
								<li>Packagin made from recycled materials</li>
								<li>5years print Warranty</li>
							</ol>
						</div>
						<div>
							<p className="font-medium text-zinc-950">Materials</p>
							<ol className="mt-3 text-zinc-700 list-disc list-inside">
								<li>High quality, durable material</li>
								<li>Scratch and fingerprint resistant coating</li>
							</ol>
						</div>
					</div>
					<div className="mt-8">
						<div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
							<div className="flow-root text-sm">
								<div className="flex items-center justify-between py-1 mt-2">
									<p className="text-gray-600">Base price</p>
									<p className="font-medium text-zinc-900">
										{priceFormater.format(BASE_PRICE / 100)}
									</p>
								</div>

								{phoneCase?.finish === "Textured Finish" ? (
									<div className="flex items-center justify-between py-1 mt-2">
										<p className="text-gray-600">Textured finish</p>
										<p className="font-medium text-zinc-900">
											{priceFormater.format(
												PRODUCT_PRICES.finish.textured / 100
											)}
										</p>
									</div>
								) : null}

								{phoneCase?.material === "Soft Polycarbonate" ? (
									<div className="flex items-center justify-between py-1 mt-2">
										<p className="text-gray-600">Soft Polycarbonate material</p>
										<p className="font-medium text-zinc-900">
											{priceFormater.format(
												PRODUCT_PRICES.material.polycarbonate / 100
											)}
										</p>
									</div>
								) : null}

								<div className="my-2 h-px bg-gray-200" />

								<div className="flex items-center justify-between py-2">
									<p className="font-semibold text-gray-900">Order total</p>
									<p className="font-semibold text-gray-900">{priceFormater.format(phoneCase!.price)}</p>
								</div>
							</div>
						</div>

            <div className="mt-8 flex justify-end pb-12">
              <Button className="px-4 sm:px-6 lg:px-8 text-white">Checkout <ArrowRight className="w-4 h-4 ml-1.5 inline"/></Button>
            </div>

					</div>
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default Preview;
