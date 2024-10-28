import {
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuContent } from "../components/DropDownMenu";
import React, { useState } from "react";
import { Button } from "./Button";
import { ChevronsUpDown, Check } from "lucide-react";
import cn from "classnames";
import useAxios from "../Utils/useAxios";

const StatusDropdown = ({
	orderStatus,
	orderId,
	refreshOrders,
}: {
	orderStatus: string;
	orderId: number;
	refreshOrders: () => void;
}) => {
	const api = useAxios();

	const SHIPPING_STATUS = ["awaiting shipping", "fulfilled", "shipped"];
	const [status, setStatus] =
		useState<(typeof SHIPPING_STATUS)[number]>(orderStatus);

	const handleChangeStatus = async (selectedStatus: string) => {
		await api
			.put(`orders/${orderId}`, {
				status: selectedStatus,
			})
			.then((response) => {
				setStatus(selectedStatus);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="w-52 flex justify-between items-center"
				>
					{status}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{SHIPPING_STATUS.map((s) => (
					<DropdownMenuItem
						onSelect={() => handleChangeStatus(s)}
						key={s}
						className={cn(
							"flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
							{
								"bg-zinc-100": s === status,
							}
						)}
					>
						<Check
							className={cn(
								"text-primary mr-2 h-4 w-4",
								s === status ? "opacity-100" : "opacity-0"
							)}
						/>
						{s}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default StatusDropdown;
