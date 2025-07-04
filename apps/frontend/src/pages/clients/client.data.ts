import { IColumns } from "@/components/table/TableComponent";
import { Pencil, Trash2 } from "lucide-react";

export interface IClient {
    id: number;
    name: string;
    lastName: string;
    cedula: string;
    address: string;
    phone: string;
    email: string;
}

export const clientsColumns: IColumns[] = [
    {
        label: 'Nombre',
        column: 'name',
        element: (data: IClient) => data.name
    },
    {
        label: 'Apellido',
        column: 'lastName',
        element: (data: IClient) => data.lastName
    },
    {
        label: 'Cédula',
        column: 'cedula',
        element: (data: IClient) => data.cedula
    },
    {
        label: 'Dirección',
        column: 'address',
        element: (data: IClient) => data.address
    },
    {
        label: 'Teléfono',
        column: 'phone',
        element: (data: IClient) => data.phone
    },
    {
        label: 'Correo',
        column: 'email',
        element: (data: IClient) => data.email
    },
    {
        label: 'Editar',
        column: 'edit',
        element: () => '',
        icon: true,
        className: 'text-blue-800',
        Icon: Pencil
    },
    {
        label: 'Eliminar',
        column: 'delete',
        element: () => '',
        icon: true,
        className: 'text-red-700',
        Icon: Trash2
    }
]