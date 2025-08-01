import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "../api";
import { ReminderBody } from "./reminder.interface";

const reminderURL = '/reminder';

export const getReminder = async () => {
    try {
        return await getDataApi(reminderURL);
    } catch (err) {
        return err;
    }
}

export const createReminder = async (data: ReminderBody) => {
    try {
        return await postDataApi(reminderURL, data);
    } catch (err) {
        return err;
    }
}
export const updateReminder = async (id: number, data: ReminderBody) => {
    try {
        return await putDataApi(`${reminderURL}/${id}`, data);
    } catch (err) {
        return err;
    }
}
export const deleteReminder = async (id: number) => {
    try {
        return await deleteDataApi(`${reminderURL}/${id}`);
    } catch (err) {
        return err;
    }
}