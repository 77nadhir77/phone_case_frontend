import { useCallback, useEffect, useState } from "react";
import useAxios from "../../Utils/useAxios";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { Button } from "../../components/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import PhonePreview from "../../components/PhonePreview";
import { Order } from "../../Utils/Order";
import { Address } from "../../Utils/Address";


const ThankYou = () => {
	const api = useAxios();
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const orderId = searchParams.get("orderId");
	const croppedImageUrl = localStorage.getItem("cropedImageUrl") || "";
	const phoneCaseColor = JSON.parse(localStorage.getItem("phoneCase") as string).color || "";


	const [order, setOrder] = useState<Order | null>(null);
	
	
	const [address, setAddress] = useState<Address | null>(null);
	
		
	const orderPaymentStatus = useCallback(async () => {
		setIsLoading(true);
		await api
		.get(`/orders/${orderId}`)
		.then((res) => {
				setOrder(res.data.order);
				setAddress(res.data.address);
				localStorage.setItem(
					"order",
					JSON.stringify({
						id: res.data.order.id,
						userId: res.data.order.userId,
						phoneCaseId: res.data.order.phoneCaseId,
						status: res.data.order.status,
					})
				);
				localStorage.setItem("address", JSON.stringify(res.data.address));
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	},[api, orderId]);

	useEffect(() => {
		orderPaymentStatus();
	}, [orderPaymentStatus]);
		
	if (isLoading) {
			return (
				<div className="w-full h-full mt-24 flex justify-center">
				<div className="flex flex-col items-center gap-2">
					<Loader2 className="h-8 w-8 animate-spin text-zinc-50" />
					<h3 className="font-semibold text-xl">Verifying your payment</h3>
					<p>This might take a moment.</p>
				</div>
			</div>
		);
	}
	

	return order && order.status === "Paid" ? (
		<div className="bg-white">
			<div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
				<div className="max-w-xl">
					<p className="text-base font-medium text-primary">Thank you!</p>
					<h1 className="mt-2 text-4xl font-bold tracking light sm:text-5xl">
						Your case is on the way!
					</h1>
					<p>We've received your order and we're processing it</p>
					<div className="mt-12 text-sm font-medium">
						<p className="font-semibold text-zinc-900">Order ID</p>
						<p className="text-zinc-500 mt-2">{order.id}</p>
					</div>
				</div>
				<div className="mt-10 border-t border-zinc-200">
					<div className="mt-10 flex flex-auto flex-col">
						<h4 className="font-semibold text-zinc-900">
							You made a great choice!
						</h4>
						<p className="mt-2 text-sm text-zinc-600">
							Your phone case will be delivered to your address soon.
						</p>
					</div>
				</div>
				<div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-l ring-inset ring-gray-900/10 lg:rounded-2xl">
					<PhonePreview
						cropedImageUrl={croppedImageUrl}
						color={phoneCaseColor}
					/>
				</div>
				<div>
					<div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
						<div>
							<p className="font-medium text-gray-900">Shipping address</p>
							<div className="mt-2 text-zinc-700">
								<address className="not-italic">
									<span className="block">{address?.name}</span>
									<span className="block">{address?.street}</span>
									<span className="block">{address?.city}</span>
								</address>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className="w-full h-full mt-24 flex justify-center">
			<div className="flex flex-col items-center gap-2">
				<h3 className="font-semibold text-xl">
					You have to order a phone case first.
				</h3>
				<p>please create your custom phone case.</p>
				<Button
					onClick={() => {
						navigate("/configure/upload");
					}}
					className="bg-primary px-4 sm:px-6 lg:px-8 text-white"
				>
					Create phone case <ArrowRightIcon className="w-4 h-4 ml-1.5 inline" />
				</Button>
			</div>
		</div>
	);
};
export default ThankYou;
