import { deleteDataApi, getDataApi, getDataFileApi, postDataApi, postFilesDataApi, putFilesDataApi } from "../api";
import { ClientBody } from "./client.interface";

const clientURL = '/clients';

export const getClients = async () => {
    try {
        return await getDataApi(clientURL);
    } catch (err) {
        return err;
    }
}
export const generateClientReportPDF = async () => {
    try {
        return await getDataFileApi(`${clientURL}/export`);
    } catch (err) {
        return err;
    }
}
export const createClient = async (data: ClientBody) => {
    try {
        return await postDataApi(clientURL, data);
    } catch (err) {
        return err;
    }
}
export const verifyClientFace = async (data: FormData) => {
    try {
        return await postFilesDataApi(`${clientURL}/verify-face`, data);
    } catch (err) {
        return err;
    }
}
export const registerClient = async (data: FormData) => {
    try {
        return await postFilesDataApi(`${clientURL}/register`, data);
    } catch (err) {
        return err;
    }
}
export const updateClient = async (clientId: number, data: FormData) => {
    try {
        return await putFilesDataApi(`${clientURL}/update/${clientId}`, data);
    } catch (err) {
        return err;
    }
}

export const deleteClient = async (id: number) => {
    try {
        return await deleteDataApi(`${clientURL}/${id}`);
    } catch (err) {
        return err;
    }
}