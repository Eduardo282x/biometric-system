import { IColumns } from "@/components/table/TableComponent";
import { Pencil, Trash2 } from "lucide-react";
import { IClients } from "@/services/client/client.interface";

export const clientsColumns: IColumns<IClients>[] = [
    {
        label: 'Nombre',
        column: 'name',
        element: (data: IClients) => data.name
    },
    {
        label: 'Apellido',
        column: 'lastName',
        element: (data: IClients) => data.lastName
    },
    {
        label: 'Cédula',
        column: 'identify',
        element: (data: IClients) => data.identify
    },
    {
        label: 'Dirección',
        column: 'address',
        element: (data: IClients) => data.address
    },
    {
        label: 'Teléfono',
        column: 'phone',
        element: (data: IClients) => data.phone
    },
    {
        label: 'Correo',
        column: 'email',
        element: (data: IClients) => data.email
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
]