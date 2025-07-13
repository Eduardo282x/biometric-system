import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "../api";
import { PlanBody } from "./plan.interface";

const planURL = '/plan';

export const getPlans = async () => {
    try {
        return await getDataApi(planURL);
    } catch (err) {
        return err;
    }
}

export const createPlan = async (data: PlanBody) => {
    try {
        return await postDataApi(planURL, data);
    } catch (err) {
        return err;
    }
}
export const updatePlan = async (id: number, data: PlanBody) => {
    try {
        return await putDataApi(`${planURL}/${id}`, data);
    } catch (err) {
        return err;
    }
}
export const deletePlan = async (id: number) => {
    try {
        return await deleteDataApi(`${planURL}/${id}`);
    } catch (err) {
        return err;
    }
}