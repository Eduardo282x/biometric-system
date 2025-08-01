import { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableComponent } from "@/components/table/TableComponent";
import { deleteClient, getClients, uploadPhotoClient } from "@/services/client/client.service";
import { ClientBody, GroupClients, IClients } from "@/services/client/client.interface";
import { FilterComponent } from "@/components/table/FilterComponent";
import { ClientsForm, DeleteClientDialog } from "./ClientsForm";
import { clientsColumns } from "./client.data";

export const Clients = () => {
    const [clients, setClients] = useState<GroupClients>({ allClients: [], clients: [] })
    const [clientSelected, setClientSelected] = useState<IClients | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    const handleExportToExcel = () => {
        // Mock export functionality
        console.log("Exporting to Excel:")
        alert("Exportando a Excel...")
    }

    useEffect(() => {
        getClientsApi();
    }, [])

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
                <p className="text-muted-foreground">Administre los clientes del gimnasio.</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <FilterComponent
                        data={clients.allClients}
                        columns={clientsColumns}
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
                columns={clientsColumns}
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


