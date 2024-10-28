import { Address } from "./Address";
import { PhoneCase } from "./PhoneCase";
import { User } from "./User";

export type Order = {
    id: number;
    Address?: Address;
    User?: User;
    phonecase?: PhoneCase;
    status: string;
    phoneCaseId: number;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
    addressId?: number;
    shippingStatus?: string;
};