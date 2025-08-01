import { Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterComponent } from "@/components/table/FilterComponent";
import { TableComponent } from "@/components/table/TableComponent";
import { useState, useEffect } from "react";
import { paymentColumns } from "./payment.data";
import { GroupPayments, IPayment, PaymentBody } from "@/services/payment/payment.interface";
import { createPayment, deletePayment, getPayments, updatePayment } from "@/services/payment/payment.service";
import { DeletePaymentDialog, PaymentForm } from "./PaymentForm";
import { IClients } from "@/services/client/client.interface";
import { getClients } from "@/services/client/client.service";

export const Payment = () => {
    const [clients, setClients] = useState<IClients[]>([])
    const [payments, setPayments] = useState<GroupPayments>({ allPayments: [], payments: [] })
    const [paymentSelected, setPaymentSelected] = useState<IPayment | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    const handleExportToExcel = () => {
        // Mock export functionality
        console.log("Exporting to Excel:")
        alert("Exportando a Excel...")
    }

    useEffect(() => {
        getPaymentsApi();
        getClientsApi();
    }, [])

    const getClientsApi = async () => {
        try {
            const response = await getClients();
            if (response) {
                setClients(response)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const getPaymentsApi = async () => {
        try {
            const response = await getPayments();
            if (response) {
                setPayments({ allPayments: response, payments: response })
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getActionTable = (action: string, data: IPayment) => {
        setPaymentSelected(data);
        if (action == 'edit') {
            setOpen(true);
        }
        if (action == 'delete') {
            setOpenDelete(true)
        }
    }

    const deleteClientApi = async (erase: boolean) => {
        if (paymentSelected && erase) {
            await deletePayment(paymentSelected.id);
            await getPaymentsApi();
        }
    }

    const onFilterUser = (payments: IPayment[]) => {
        setPayments(prev => ({ ...prev, payments }))
    }

    const newClients = () => {
        setPaymentSelected(null);
        setOpen(true);
    }

    const getActionForm = async (data: PaymentBody) => {
        if (paymentSelected) {
            await updatePayment(paymentSelected.id, data)
        } else {
            await createPayment(data)
        }
        setOpen(false);
        await getPaymentsApi();
    }



    return (
        <div className="space-y-4 text-white">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Pagos</h1>
                <p className="text-muted-foreground">Administre los pagos del gimnasio.</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <FilterComponent
                        data={payments.allPayments}
                        columns={paymentColumns}
                        placeholder="Buscar Pago..."
                        onSearch={onFilterUser}
                    />
                </div>

                <div className="flex gap-2">
                    <Button onClick={newClients} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Pago
                    </Button>

                    <Button className="text-black" variant="outline" onClick={handleExportToExcel}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar a Excel
                    </Button>
                </div>
            </div>

            <TableComponent
                data={payments.payments}
                columns={paymentColumns}
                actionTable={getActionTable}
            />

            {open && (
                <PaymentForm
                    data={paymentSelected}
                    open={open}
                    setOpen={setOpen}
                    onSubmit={getActionForm}
                    clients={clients}
                />
            )}

            {openDelete && (
                <DeletePaymentDialog
                    open={openDelete}
                    setOpen={setOpenDelete}
                    onDelete={deleteClientApi}
                />
            )}
        </div>
    )
}

