import { IColumns } from "@/components/table/TableComponent";
import { Pencil, Trash2 } from "lucide-react";

export interface IUser {
    id: number,
    name: string;
    lastName: string;
    username: string;
    rol: string;
}

export const usersColumns: IColumns[] = [
    {
        label: 'Nombre',
        column: 'name',
        element: (data: IUser) => data.name
    },
    {
        label: 'Apellido',
        column: 'lastName',
        element: (data: IUser) => data.lastName
    },
    {
        label: 'Usuario',
        column: 'username',
        element: (data: IUser) => data.username
    },
    {
        label: 'Rol',
        column: 'rol',
        element: (data: IUser) => data.rol
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

// <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
//                                             <Pencil className="h-4 w-4" />
//                                             <span className="sr-only">Editar</span>
//                                         </Button>