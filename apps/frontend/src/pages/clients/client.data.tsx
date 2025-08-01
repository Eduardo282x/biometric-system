import { IColumns } from "@/components/table/TableComponent";
import { Pencil, Trash2 } from "lucide-react";
import { IClients } from "@/services/client/client.interface";
import { FaRegUser } from "react-icons/fa";

// eslint-disable-next-line react-refresh/only-export-components
export const clientsColumns: IColumns<IClients>[] = [
    {
        label: 'Imagen',
        column: 'photo',
        element: (data: IClients) => (data.photo !== '' && data.photo !== null) ? <RenderImage imageUrl={data.photo} /> : <div className="flex items-center justify-center w-10 mx-auto border rounded-full h-10 overflow-hidden"><FaRegUser size={20} /></div>
    },
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
];

export const RenderImage = ({ imageUrl }: { imageUrl: string }) => {
    const getImage = `http://localhost:3000/public/faces/${imageUrl}`;
    return (
        <div className="w-full flex items-center justify-center">
            <img className="w-10 h-10 rounded-full object-cover" alt="https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Free-Download.png" src={getImage} />
        </div>
    )
}