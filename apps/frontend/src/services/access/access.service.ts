import { postDataApi } from "../api";
import { ClientIdentification } from "../client/client.interface";

const accessURL = '/payments'

export const findClient = async (data: ClientIdentification) => {
    try {
        return await postDataApi(`${accessURL}/find`, data);
    } catch (err) {
        return err;
    }
}