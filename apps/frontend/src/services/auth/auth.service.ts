import { postDataApi } from "../api";
import { ILogin } from "./auth.interface";

const authURL = '/auth'

export const authLogin = async (data: ILogin) => {
    try {
        return await postDataApi(authURL, data);
    } catch (err) {
        return err;
    }
}