import { IColumns } from "@/components/table/TableComponent";
import { formatDateShort, formatHourShort } from "@/lib/formatters";
import { IReminderHistory } from "@/services/reminder/reminder.interface";

export const reminderHistoryColumns: IColumns<IReminderHistory>[] = [
    {
        label: 'Cliente',
        column: 'client',
        element: (data: IReminderHistory) => `${data.client.name} ${data.client.lastName}`
    },
    {
        label: 'Correo',
        column: 'reminder',
        element: (data: IReminderHistory) => data.client.email
    },
    {
        label: 'Tipo de Recordatorio',
        column: 'reminder',
        element: (data: IReminderHistory) => data.reminder.name
    },
    {
        label: 'Fecha',
        column: 'createdAt',
        element: (data: IReminderHistory) => formatDateShort(data.createdAt),
    },
    {
        label: 'Hora',
        column: 'createdAt',
        element: (data: IReminderHistory) => formatHourShort(data.createdAt),
    },
]
