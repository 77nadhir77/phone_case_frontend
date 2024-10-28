import React, { useEffect, useState } from "react";
import useAxios from "../../Utils/useAxios";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../../components/Card";
import { priceFormater } from "../../config/products";
import { Progress } from "../../components/Progress";
import { Order } from "../../Utils/Order";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/Table";
import StatusDropdown from "../../components/StatusDropdown";

const Dashboard: React.FC = () => {
	const api = useAxios();
	const [orders, setOrders] = useState<Order[] | null>(null);
	const [lastWeekSum, setLastWeekSum] = useState<number>(0);
	const [lastMonthSum, setLastMonthSum] = useState<number>(0);

	

	const getOrders = async () => {
		await api
			.get("/orders")
			.then((res) => {
				console.log(res.data);
				setOrders(res.data.orders);
				setLastWeekSum(res.data.lastWeekSum);
				setLastMonthSum(res.data.lastMonthSum);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		console.log("fetching orders");
		getOrders();
	}, []);

	const WEEKLY_GOAL = 500;
	const MONTHLY_GOAL = 2500;

	return (
		<div className="flex min-h-screen w-full bg-muted/40">
			<div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
				<div className="flex flex-col gap-16">
					<div className="grid gap-4 sm:grid-cols-2">
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Last week</CardDescription>
								<CardTitle className="text-4xl">
									{priceFormater.format(lastWeekSum)}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-sm text-muted-foreground">
									of {priceFormater.format(WEEKLY_GOAL)} goal
								</div>
							</CardContent>
							<CardFooter>
								<Progress value={(lastWeekSum * 100) / WEEKLY_GOAL} max={100} />
							</CardFooter>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Last month</CardDescription>
								<CardTitle className="text-4xl">
									{priceFormater.format(lastMonthSum)}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-sm text-muted-foreground">
									of {priceFormater.format(MONTHLY_GOAL)} goal
								</div>
							</CardContent>
							<CardFooter>
								<Progress value={(lastMonthSum * 100) / MONTHLY_GOAL} />
							</CardFooter>
						</Card>
					</div>
					<h1 className="text-3xl font-bold tracking-tight">Incoming Orders</h1>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Customer</TableHead>
								<TableHead className="hidden sm:table-cell">Status</TableHead>
								<TableHead className="hidden sm:table-cell">
									Purshase date
								</TableHead>
								<TableHead className="text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders?.map((order: Order) => (
								<TableRow key={order.id} className="bg-accent">
									<TableCell>
										<div className="font-medium">{order.Address?.name}</div>
										<div className="hidden text-sm text-muted-foreground md:inline">
											{order.Address?.email}
										</div>
									</TableCell>
									<TableCell><StatusDropdown orderStatus={order?.shippingStatus as string} orderId={order?.id} refreshOrders={getOrders} /></TableCell>
									<TableCell className="hidden md:table-cell">
										{new Date(order.createdAt ?? "").toLocaleDateString()}
									</TableCell>
									<TableCell className="text-right">
										{priceFormater.format(order.phonecase?.price as number)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
