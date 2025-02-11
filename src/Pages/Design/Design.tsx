import "react-toastify/dist/ReactToastify.css";
import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import Steps from "../../components/Steps";
import { useUploadContext } from "../../Context/UploadProvider";
import { useEffect, useRef, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import * as AspectRatioPeremitive from "@radix-ui/react-aspect-ratio";
import { Rnd } from "react-rnd";
import HandleComponent from "../../components/HandleComponent";
import { ScrollArea } from "../../components/scroll-area";
import { RadioGroup } from "@headlessui/react";
import {
	COLORS,
	FINISHES,
	MATERIALS,
	MODELS,
} from "../../Utils/option-validators";
import { Label } from "../../components/Label";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "../../components/DropDownMenu";
import { Button } from "../../components/Button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { BASE_PRICE, priceFormater } from "../../config/products";
import { useNavigate } from "react-router-dom";
import useAxios from "../../Utils/useAxios";

const Design = () => {
	const AspectRatio = AspectRatioPeremitive.Root;

	const [options, setOptions] = useState<{
		color: (typeof COLORS)[number];
		model: (typeof MODELS.options)[number];
		materials: (typeof MATERIALS.options)[number];
		finishes: (typeof FINISHES.options)[number];
	}>({
		color: COLORS[0],
		model: MODELS.options[0],
		materials: MATERIALS.options[0],
		finishes: FINISHES.options[0],
	});

	const api = useAxios();
	const navigate = useNavigate();
	const {
		getTheUploadedImage,
		image,
		setCropedImageUrl,
		setPhoneCase,
		setOrder,
	} = useUploadContext();

	useEffect(() => {
		getTheUploadedImage();
	}, []);

	const [renderedDimensions, setRenderedDimensions] = useState<{
		height: number;
		width: number;
	}>({
		height: 0,
		width: 0,
	});

	const [renderedPositions, setRenderedPositions] = useState<{
		x: number;
		y: number;
	}>({
		x: 0,
		y: 0,
	});

	const phoneCaseRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const saveConfiguration = async () => {
		try {
			const {
				left: caseLeft,
				top: caseTop,
				width,
				height,
			} = phoneCaseRef.current!.getBoundingClientRect();

			const { left: containerLeft, top: containerTop } =
				containerRef.current!.getBoundingClientRect();

			const topOffset = caseTop - containerTop;
			const leftOffset = caseLeft - containerLeft;

			const actualX = renderedPositions.x - leftOffset;
			const actualY = renderedPositions.y - topOffset;

			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");

			const userImage = new Image();
			userImage.crossOrigin = "anonymous";
			userImage.src = image.url;
			await new Promise((resolve) => {
				userImage.onload = resolve;
			});

			ctx?.drawImage(
				userImage,
				actualX,
				actualY,
				renderedDimensions.width,
				renderedDimensions.height
			);

			const base64 = canvas.toDataURL();
			const base64Data = base64.split(",")[1];

			const blob = base64ToBlob(base64Data, "image/png");
			const file = new File([blob], "filename.png", { type: "image/png" });

			const formData = new FormData();
			formData.append("image", file);
			formData.append(
				"json",
				JSON.stringify({
					color: options.color.label,
					model: options.model.label,
					material: options.materials.label,
					finish: options.finishes.label,
					price:
						(BASE_PRICE + options.finishes.price + options.materials.price) /
						100,
				})
			);

			let response = await api.post(
				`/upload/crop/${image.filename.replace("/", "").slice(7)}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 200) {
				setCropedImageUrl(response.data.cropedImageUrl);
				setPhoneCase({
					id: response.data.phoneCase.id,
					color: response.data.phoneCase.color,
					finish: response.data.phoneCase.finish,
					material: response.data.phoneCase.material,
					model: response.data.phoneCase.caseModel,
					price: response.data.phoneCase.price,
					imageId: response.data.phoneCase.imageId,
				});
				setOrder({
					id: response.data.order.id,
					status: response.data.order.status,
					phoneCaseId: response.data.order.phoneCaseId,
					userId: response.data.order.userId,
				});
				localStorage.setItem("cropedImageUrl", response.data.cropedImageUrl);
				localStorage.setItem(
					"phoneCase",
					JSON.stringify({
						id: response.data.phoneCase.id,
						color: response.data.phoneCase.color,
						finish: response.data.phoneCase.finish,
						material: response.data.phoneCase.material,
						model: response.data.phoneCase.caseModel,
						price: response.data.phoneCase.price,
						description: response.data.phoneCase.description,
						imageId: response.data.phoneCase.imageId,
					})
				);
				localStorage.setItem(
					"order",
					JSON.stringify({
						id: response.data.order.id,
						status: response.data.order.status,
						phoneCaseId: response.data.order.phoneCaseId,
						userId: response.data.order.userId,
					})
				);
				navigate(`/configure/preview`);
			}
		} catch (error) {
			toast.error(`${error}`, {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: 0,
				theme: "light",
				transition: Bounce,
			});
		}
	};

	function base64ToBlob(base64: string, mimType: string) {
		const byteCharacters = atob(base64);
		const byteNumbers = new Array(byteCharacters.length);

		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);

		return new Blob([byteArray], { type: mimType });
	}

	return (
		<MaxWidthWrapper>
			<ToastContainer />
			<Steps />
			<div className="relative mb-20 grid grid-cols-1 lg:grid-cols-3 mt-20 pb-20">
				<div
					ref={containerRef}
					className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				>
					<div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
						<AspectRatio
							ref={phoneCaseRef}
							ratio={896 / 1831}
							className="pointer-events-none relative z-40 aspect-[896/1831] w-full"
						>
							<img
								alt="phone image"
								src="/phone-template.png"
								className="pointer-events-none z-40 select-none"
							/>
						</AspectRatio>
						<div className="absolute z-30 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
						<div
							className={`absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] bg-${options.color.tw}`}
						/>
					</div>
					<Rnd
						lockAspectRatio
						className="absolute z-20 border-[3px] border-primary"
						resizeHandleComponent={{
							bottomRight: <HandleComponent />,
							bottomLeft: <HandleComponent />,
							topRight: <HandleComponent />,
							topLeft: <HandleComponent />,
						}}
						onResizeStop={(e, direction, ref, delta, { x, y }) => {
							setRenderedDimensions({
								height: parseInt(ref.style.height.slice(0, -2)),
								width: parseInt(ref.style.width.slice(0, -2)),
							});
							setRenderedPositions({ x, y });
						}}
						onDragStop={(e, data) => {
							setRenderedPositions({ x: data.x, y: data.y });
						}}
					>
						<div className="relative w-full h-full">
							<img
								src={image.url}
								alt="uploaded image"
								className="pointer-events-none h-full w-full object-cover"
							/>
						</div>
					</Rnd>
				</div>
				<div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
					<ScrollArea className="relative flex-1 overflow-auto">
						<div
							area-hidden="true"
							className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
						/>
						<div className="px-8 pb-12 pt-8">
							<h2 className="tracking-tight front-bold text-xl">
								Customize your phone case
							</h2>
							<div className="w-full h-px bg-zinc-200 my-6" />
							<div className="relative mt-4 h-full flex flex-col justify-between">
								<div className="flex flex-col gap-6">
									<RadioGroup
										value={options.color}
										onChange={(val) =>
											setOptions((prevOptions) => ({
												...prevOptions,
												color: val,
											}))
										}
									>
										<RadioGroup.Label className="text-sm font-bold text-zinc-500">{`Color: ${options.color.label}`}</RadioGroup.Label>
										<div className="mt-3 flex items-center space-x-3">
											{COLORS.map((color) => (
												<RadioGroup.Option
													key={color.label}
													value={color}
													className="raltive -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent"
													style={{
														borderColor:
															color === options.color ? color.hex : "",
													}}
												>
													<span
														className={`bg-${color.tw} w-8 h-8 rounded-full border-${options.color.tw} border-opacity-10`}
													/>
												</RadioGroup.Option>
											))}
										</div>
									</RadioGroup>
									<div className="relative flex flex-col gap-3 w-full">
										<Label>Model</Label>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="outline"
													role="combobox"
													className="w-full justify-between"
												>
													{options.model.label}
													<ChevronsUpDown className="ml-2 w-4 h-4 shrink-0 opacity-50" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												{MODELS.options.map((model) => (
													<DropdownMenuItem
														key={model.label}
														className={`bg-white flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100 ${
															model.label === options.model.label
																? "bg-zinc-100"
																: null
														}`}
														onClick={() =>
															setOptions((prevOptions) => ({
																...prevOptions,
																model,
															}))
														}
													>
														<Check
															className={`mr-2 h-4 w-4 ${
																model.label === options.model.label
																	? "opacity-100"
																	: "opacity-0"
															}`}
														/>
														{model.label}
													</DropdownMenuItem>
												))}
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
									{[MATERIALS, FINISHES].map(
										({ name, options: selectableOptions }) => (
											<RadioGroup
												key={name}
												value={options[name]}
												onChange={(val) => {
													setOptions((prevOptions) => ({
														...prevOptions,
														[name]: val,
													}));
												}}
											>
												<Label>
													{name.charAt(0).toUpperCase() + name.slice(1)}
												</Label>
												<div className="mt-3 space-y-4">
													{selectableOptions.map((option) => (
														<RadioGroup.Option
															key={option.label}
															value={option}
															className="relative block cursor-pointer rounded-lg bg-white px-6 py-6 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between"
															style={{
																borderColor:
																	option === options[name] ? "#4CAF4F" : "",
															}}
														>
															<span className="flex items-center">
																<span className="flex flex-col text-sm">
																	<RadioGroup.Label
																		className="font-medium text-gray-900"
																		as="span"
																	>
																		{option.label}
																	</RadioGroup.Label>
																	{option.description && (
																		<RadioGroup.Description
																			as="span"
																			className="text-gray-500"
																		>
																			<span className="block sm:inline">
																				{option.description}
																			</span>
																		</RadioGroup.Description>
																	)}
																</span>
															</span>
															<RadioGroup.Description
																as="span"
																className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:text-right sm:flex-col"
															>
																<span className="text-gray-900 font-medium">
																	{priceFormater.format(option.price / 100)}
																</span>
															</RadioGroup.Description>
														</RadioGroup.Option>
													))}
												</div>
											</RadioGroup>
										)
									)}
								</div>
							</div>
						</div>
					</ScrollArea>
					<div className="w-full px-8 h-16 bg-white">
						<div className="h-px w-full bg-zinc-200" />
						<div className="w-full h-full flex justify-end items-center">
							<div className="w-full flex gap-6 items-center">
								<p className="text-medium whitespace-nowrap">
									{priceFormater.format(
										(BASE_PRICE +
											options.materials.price +
											options.finishes.price) /
											100
									)}
								</p>
								<Button
									onClick={saveConfiguration}
									className="w-full text-white"
									size="sm"
								>
									Continue
									<ArrowRight className="h-4 w-4 ml-1.5 inline" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default Design;
