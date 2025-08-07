import { IFilters } from "@/pages/payment/Payment";
import { deleteDataApi, getDataApi, postDataApi, postDataFileApi, putDataApi } from "../api";
import { PaymentBody } from "./payment.interface";

const paymentURL = '/payments';

export const getPayments = async () => {
    try {
        return await getDataApi(paymentURL);
    } catch (err) {
        return err;
    }
}

export const createPayment = async (data: PaymentBody) => {
    try {
        return await postDataApi(paymentURL, data);
    } catch (err) {
        return err;
    }
}
export const generatePaymentReportPDF = async (data: IFilters) => {
    try {
        return await postDataFileApi(`${paymentURL}/export`, data);
    } catch (err) {
        return err;
    }
}
export const updatePayment = async (id: number, data: PaymentBody) => {
    try {
        return await putDataApi(`${paymentURL}/${id}`, data);
    } catch (err) {
        return err;
    }
}
export const deletePayment = async (id: number) => {
    try {
        return await deleteDataApi(`${paymentURL}/${id}`);
    } catch (err) {
        return err;
    }
}