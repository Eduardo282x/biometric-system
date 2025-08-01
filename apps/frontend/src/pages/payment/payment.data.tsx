import { IColumns } from "@/components/table/TableComponent";
import { Pencil, Trash2 } from "lucide-react";
import { IPayment } from "@/services/payment/payment.interface";
import { formatDateShort, formatHourShort } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

export const paymentColumns: IColumns<IPayment>[] = [
    {
        label: 'Cliente',
        column: 'client',
        element: (data: IPayment) => `${data.client.name} ${data.client.lastName}`
    },
    {
        label: 'Monto',
        column: 'amount',
        element: (data: IPayment) => `${data.amount}$`
    },
    {
        label: 'Método de pago',
        column: 'methodPayment',
        element: (data: IPayment) => data.methodPayment
    },
    {
        label: 'Fecha',
        column: 'datePay',
        element: (data: IPayment) => formatDateShort(data.datePay)
    },
    {
        label: 'Hora',
        column: 'datePay',
        element: (data: IPayment) => formatHourShort(data.datePay)
    },
    {
        label: 'Estado',
        column: 'status',
        element: (data: IPayment) => <Badge variant={data.status ? 'secondary' : 'destructive'}>{data.status ? 'Al dia' : 'Moroso'}</Badge>
    },
    {
        label: 'Proximo Pago',
        column: 'nextDatePay',
        element: (data: IPayment) => formatDateShort(data.nextDatePay)
    },
    {
        label: 'Registrado por',
        column: 'user',
        element: (data: IPayment) => `${data.user.name} ${data.user.lastName}`
    },
    {
        label: 'Editar',
        column: 'edit',
        element: () => '',
        icon: true,
        className: () => 'text-blue-800',
        Icon: Pencil
    },
    {
        label: 'Eliminar',
        column: 'delete',
        element: () => '',
        icon: true,
        className: () => 'text-red-700',
        Icon: Trash2
    }
];