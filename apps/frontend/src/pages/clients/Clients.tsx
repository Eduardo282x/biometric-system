import { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IColumns, TableComponent } from "@/components/table/TableComponent";
import { deleteClient, generateClientReportPDF, getClients, uploadPhotoClient } from "@/services/client/client.service";
import { ClientBody, GroupClients, IClients } from "@/services/client/client.interface";
import { FilterComponent } from "@/components/table/FilterComponent";
import { ClientsForm, DeleteClientDialog } from "./ClientsForm";
import { clientsColumns } from "./client.data";
import { IUser } from "@/services/user/user.interface";

export const Clients = () => {
    const [clients, setClients] = useState<GroupClients>({ allClients: [], clients: [] })
    const [clientSelected, setClientSelected] = useState<IClients | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [columns, setColumns] = useState<IColumns<IClients>[]>(clientsColumns);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    const handleExportToExcel = async () => {
        const response = await generateClientReportPDF() as Blob;
        const url = URL.createObjectURL(response)
        const link = window.document.createElement("a")
        link.href = url
        link.download = `Reporte de Clientes.xlsx`;
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    useEffect(() => {
        getClientsApi();
        const getUserData: IUser = JSON.parse(localStorage.getItem('userData') as string);
        if (getUserData && getUserData.role == 'RECEPCIONISTA') {
            validateUser()
        }
    }, [])

    const validateUser = () => {
        setColumns(clientsColumns.filter(item => !item.icon))
    }

    const getClientsApi = async () => {
        try {
            const response = await getClients();
            if (response) {
                setClients({ allClients: response, clients: response })
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getActionTable = (action: string, data: IClients) => {
        setClientSelected(data);
        if (action == 'edit') {
            setOpen(true);
        }
        if (action == 'delete') {
            setOpenDelete(true)
        }
    }

    const deleteClientApi = async (erase: boolean) => {
        if (clientSelected && erase) {
            await deleteClient(clientSelected.id);
            await getClientsApi();
        }
    }

    const onFilterUser = (clients: IClients[]) => {
        setClients(prev => ({ ...prev, clients }))
    }

    const newClients = () => {
        setClientSelected(null);
        setOpen(true);
    }

    // const getPicture = async (picture: File, client: ClientBody) => {
    //     const formData = new FormData();
    //     formData.append('image', picture);
    //     formData.append('data', client.identify);
    //     await uploadPhotoClient(formData);
    // }

    const getActionForm = async (picture: File | null, data: ClientBody) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));

        if (picture) {
            formData.append('image', picture);
        }

        await uploadPhotoClient(formData); // única función para manejar ambos casos
        setOpen(false);
        await getClientsApi();
    }

    return (
        <div className="space-y-4 text-white">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Clientes</h1>
                <p className="text-gray-100">Administre los clientes del gimnasio.</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <FilterComponent
                        data={clients.allClients}
                        columns={columns}
                        placeholder="Buscar clientes..."
                        onSearch={onFilterUser}
                    />
                </div>

                <div className="flex gap-2">
                    <Button onClick={newClients} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Clientes
                    </Button>

                    <Button className="text-black" variant="outline" onClick={handleExportToExcel}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar a Excel
                    </Button>
                </div>
            </div>

            <TableComponent
                data={clients.clients}
                columns={columns}
                actionTable={getActionTable}
            />

            {open && (
                <ClientsForm
                    data={clientSelected}
                    open={open}
                    setOpen={setOpen}
                    onSubmit={() => console.log('nada')}
                    onSubmitPicture={getActionForm}
                />
            )}

            {openDelete && (
                <DeleteClientDialog
                    open={openDelete}
                    setOpen={setOpenDelete}
                    onDelete={deleteClientApi}
                />
            )}
        </div>
    )
}


