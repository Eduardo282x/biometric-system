import { IClients } from "../client/client.interface";
import { IUser } from "../user/user.interface";

export interface PaymentBody {
    clientId: number;
    userId: number;
    methodPayment: string;
    amount: number;
    description: string;
    nextDatePay: Date;
}

export interface GroupPayments {
    allPayments: IPayment[];
    allPaymentsHistoryFilters: IPayment[];
    payments: IPayment[];
    paymentsFilters: IPayment[];
    history: IPayment[];
}

export interface IPayment {
    id: number
    clientId: number
    client: IClients
    userId: number
    user: IUser
    methodPayment: string
    amount: number;
    status: boolean;
    description: string
    datePay: Date
    nextDatePay: Date
}