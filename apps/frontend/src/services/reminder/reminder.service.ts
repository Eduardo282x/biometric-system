import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "../api";
import { ReminderBody, SendReminderBody } from "./reminder.interface";

const reminderURL = '/reminder';

export const getReminder = async () => {
    try {
        return await getDataApi(reminderURL);
    } catch (err) {
        return err;
    }
}
export const getReminderHistory = async () => {
    try {
        return await getDataApi(`${reminderURL}/history`);
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
export const sendReminders = async (data: SendReminderBody) => {
    try {
        return await postDataApi(`${reminderURL}/send`, data);
    } catch (err) {
        return err;
    }
}
export const updateReminder = async (id: string, data: ReminderBody) => {
    try {
        return await putDataApi(`${reminderURL}/${id}`, data);
    } catch (err) {
        return err;
    }
}
export const deleteReminder = async (id: string) => {
    try {
        return await deleteDataApi(`${reminderURL}/${id}`);
    } catch (err) {
        return err;
    }
}