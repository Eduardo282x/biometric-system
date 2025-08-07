import { Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterComponent } from "@/components/table/FilterComponent";
import { TableComponent } from "@/components/table/TableComponent";
import { useState, useEffect } from "react";
import { paymentColumns, paymentHistoryColumns } from "./payment.data";
import { GroupPayments, IPayment, PaymentBody } from "@/services/payment/payment.interface";
import { createPayment, deletePayment, generatePaymentReportPDF, getPayments, updatePayment } from "@/services/payment/payment.service";
import { DeletePaymentDialog, PaymentForm } from "./PaymentForm";
import { IClients } from "@/services/client/client.interface";
import { getClients } from "@/services/client/client.service";
import { IUser } from "@/services/user/user.interface";
import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Autocomplete } from "@/components/autocomplete/Autocomplete";

export const Payment = () => {
    const [clients, setClients] = useState<IClients[]>([])
    const [payments, setPayments] = useState<GroupPayments>({ allPayments: [], payments: [], history: [] })
    const [paymentSelected, setPaymentSelected] = useState<IPayment | null>(null);
    const [view, setView] = useState<'payment' | 'history'>('payment');
    const [open, setOpen] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [userData, setUserData] = useState<IUser | null>(null);

    const handleExportToExcel = async () => {
        const response = await generatePaymentReportPDF() as Blob;
        const url = URL.createObjectURL(response)
        const link = window.document.createElement("a")
        link.href = url
        link.download = `Reporte de Pagos.xlsx`
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    useEffect(() => {
        getPaymentsApi();
        getClientsApi();

        const getUserData = JSON.parse(localStorage.getItem('userData') as string);
        if (getUserData) {
            setUserData(getUserData);
        }
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
            const response: { payment: IPayment[], history: IPayment[] } = await getPayments();
            if (response) {
                setPayments({
                    allPayments: response.payment,
                    payments: response.payment,
                    history: response.history
                })
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
        const parseData = {
            ...data,
            userId: userData ? userData.id : 1
        }

        if (paymentSelected) {
            await updatePayment(paymentSelected.id, parseData)
        } else {
            await createPayment(parseData)
        }
        setOpen(false);
        await getPaymentsApi();
    }

    const applyFilters = () => {

    }

    const removeDuplicate = (list: string[]) => {
        return [...new Set(list)];
    }

    return (
        <div className="space-y-4 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Pagos</h1>
                    <p className="text-gray-100">Administre los pagos del gimnasio.</p>
                </div>

                <div className="flex items-center justify-between gap-2 p-1 rounded-lg bg-zinc-700">
                    <p onClick={() => setView('payment')} className={`${view == 'payment' && 'bg-zinc-900'} px-3 py-1 cursor-pointer rounded-lg`}>Pagos</p>
                    <p onClick={() => setView('history')} className={`${view == 'history' && 'bg-zinc-900'} px-3 py-1 cursor-pointer rounded-lg`}>Historial</p>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="relative w-72 flex gap-2 items-center">
                    {view == 'payment' ?
                        <FilterComponent
                            data={payments.allPayments}
                            columns={paymentColumns}
                            placeholder="Buscar Pago..."
                            onSearch={onFilterUser}
                        />
                        :
                        <FilterComponent
                            data={payments.history}
                            columns={paymentHistoryColumns}
                            placeholder="Buscar Pago..."
                            onSearch={onFilterUser}
                        />}

                    <DropdownColumnFilter>
                        <FilterPayments
                            clients={clients}
                            methodPayments={removeDuplicate(payments.allPayments.map(item => item.methodPayment))} />
                    </DropdownColumnFilter>
                </div>


                <div className="flex gap-2">
                    {view == 'payment' && (
                        <Button onClick={newClients} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Pago
                        </Button>
                    )}

                    <Button className="text-black" variant="outline" onClick={handleExportToExcel}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar a Excel
                    </Button>
                </div>
            </div>

            {view == 'payment' && (
                <TableComponent
                    data={payments.payments}
                    columns={paymentColumns}
                    actionTable={getActionTable}
                />
            )}

            {view == 'history' && (
                <TableComponent
                    data={payments.history}
                    columns={paymentHistoryColumns}
                    actionTable={getActionTable}
                />
            )}

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

interface FilterPaymentsProps {
    methodPayments: string[];
    clients: IClients[]
}

export const FilterPayments = ({ methodPayments, clients }: FilterPaymentsProps) => {
    return (
        <div className="flex flex-col gap-2">
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="payed">Al dia</SelectItem>
                    <SelectItem value="noPayed">Moroso</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Método de pago" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {methodPayments && methodPayments.map(item => (
                        <SelectItem value={item}>{item}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Autocomplete
                data={clients.map(item => ({ label: `${item.name} ${item.lastName}`, value: item.id.toString() }))}
                placeholder="Buscar cliente..."
                onChange={(value) => console.log(value)}
            />
        </div>
    )
}