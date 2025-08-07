import { IClients } from "../client/client.interface";


export interface ReminderBody {
    name: string;
    subject: string;
    message: string;
    daysBefore: number;
    isActive: boolean;
}

export interface SendReminderBody {
    reminderId: string;
    clientIds: number[];
}

export interface IReminder {
    id: string;
    name: string;
    subject: string;
    message: string;
    daysBefore: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IReminderHistory {
    id: string
    clientId: number
    reminderId: string
    client: IClients
    reminder: IReminder
    createdAt: Date
    updatedAt: Date
}