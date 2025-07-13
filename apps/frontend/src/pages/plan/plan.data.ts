import { IColumns } from "@/components/table/TableComponent";
import { formatOnlyNumberWithDots } from "@/lib/formatters";
import { IPlan } from "@/services/plan/plan.interface";
import { Pencil, Trash2 } from "lucide-react";

export const planColumns: IColumns<IPlan>[] = [
    {
        label: 'Plan',
        column: 'name',
        element: (data: IPlan) => data.name
    },
    {
        label: 'Precio',
        column: 'price',
        element: (data: IPlan) => `${formatOnlyNumberWithDots(data.price)} $`
    },
    {
        label: 'Descripción',
        column: 'description',
        element: (data: IPlan) => data.description
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