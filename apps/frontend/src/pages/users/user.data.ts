import { IColumns } from "@/components/table/TableComponent";
import { IUser, Role } from "@/services/user/user.interface";
import { Pencil, Trash2 } from "lucide-react";

export const usersColumns: IColumns<IUser>[] = [
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
        column: 'role',
        element: (data: IUser) => setRoleName(data.role),
        className: () => 'capitalize'
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

export const setRoleName = (role: Role): string => {
    switch (role) {
        case 'ADMIN':
            return 'Administrador';
        case 'GERENTE':
            return 'Gerente';
        case 'RECEPCIONISTA':
            return 'Recepcionista'
        default:
            return '';
    }
}