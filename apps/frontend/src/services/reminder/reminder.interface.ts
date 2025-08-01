

export interface ReminderBody {
    name: string;
    subject: string;
    message: string;
    daysBefore: number;
    isActive: boolean;
}

export interface IReminder {
    id: number;
    name: string;
    subject: string;
    message: string;
    daysBefore: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}