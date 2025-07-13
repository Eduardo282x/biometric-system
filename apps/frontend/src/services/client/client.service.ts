import { deleteDataApi, getDataApi, postDataApi, postFilesDataApi, putDataApi } from "../api";
import { ClientBody } from "./client.interface";

const clientURL = '/clients';

export const getClients = async () => {
    try {
        return await getDataApi(clientURL);
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
export const uploadPhotoClient = async (data: FormData) => {
    try {
        return await postFilesDataApi(clientURL, data);
    } catch (err) {
        return err;
    }
}
export const updateClient = async (id: number, data: ClientBody) => {
    try {
        return await putDataApi(`${clientURL}/${id}`, data);
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