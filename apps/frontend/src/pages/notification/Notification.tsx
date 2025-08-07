import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeleteReminderDialog, NotificationForm, SendReminders } from "./NotificationForm"
import { IReminder, IReminderHistory, ReminderBody, SendReminderBody } from "@/services/reminder/reminder.interface"
import { createReminder, deleteReminder, getReminder, getReminderHistory, sendReminders, updateReminder } from "@/services/reminder/reminder.service"
import { TableComponent } from "@/components/table/TableComponent"
import { reminderHistoryColumns } from "./notification.data"
import { IClients } from "@/services/client/client.interface"
import { getClients } from "@/services/client/client.service"

export const Notification = () => {
    const [clients, setClients] = useState<IClients[]>([])
    const [reminderConfigs, setReminderConfigs] = useState<IReminder[]>([])
    const [reminderHistory, setReminderHistory] = useState<IReminderHistory[]>([])
    const [openForm, setOpenForm] = useState<boolean>(false)
    const [openFormSend, setOpenFormSend] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [reminderSelected, setReminderSelected] = useState<IReminder | null>(null)


    useEffect(() => {
        getReminderApi();
        getClientsApi();
        getReminderHistoryApi();
    }, [])

    const getClientsApi = async () => {
        try {
            const response = await getClients()
            if (response && response.length > 0)
                setClients(response)
        } catch (err) {
            console.log(err);
        }
    }
    const getReminderApi = async () => {
        try {
            const response = await getReminder()
            if (response && response.length > 0)
                setReminderConfigs(response)
        } catch (err) {
            console.log(err);
        }
    }
    const getReminderHistoryApi = async () => {
        try {
            const response = await getReminderHistory()
            if (response && response.length > 0)
                setReminderHistory(response)
        } catch (err) {
            console.log(err);
        }
    }

    const handleEdit = (reminder: IReminder) => {
        setReminderSelected(reminder);
        setOpenForm(true);
    }

    const handleToggleActive = async (reminderId: string) => {
        setReminderConfigs(
            reminderConfigs.map((reminder) =>
                reminder.id === reminderId ? { ...reminder, isActive: !reminder.isActive } : reminder,
            ),
        )
    }

    const openNotificationForm = () => {
        setReminderSelected(null);
        setOpenForm(true)
    }

    const getChangesForm = async (data: ReminderBody) => {
        if (reminderSelected) {
            await updateReminder(reminderSelected.id, data)
        } else {
            await createReminder(data)
        }
        await getReminderApi();
        setOpenForm(false);
    }

    const deleteReminderApi = async (data: boolean) => {
        if (data && reminderSelected) {
            await deleteReminder(reminderSelected.id)
            setOpenForm(false);
        }
    }

    const openDialogSendReminders = () => {
        setOpenFormSend(true)
    }

    const sendRemindersApi = async (sendData: SendReminderBody) => {
        await sendReminders(sendData)
        setOpenFormSend(false);
        await getReminderHistoryApi();
    }

    return (
        <div className="space-y-6 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight ">Gestión de Recordatorios</h1>
                    <p className="text-gray-100">
                        Configure recordatorios automáticos por correo electrónico para los pagos de mensualidades.
                    </p>
                </div>

                <Button onClick={openDialogSendReminders} className="bg-blue-600 hover:bg-blue-700">
                    <SendHorizontal className="mr-2 h-4 w-4" />
                    Prueba de envió
                </Button>
            </div>

            <Tabs defaultValue="configurations" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-[#262626] p-1 h-full">
                    <TabsTrigger className="cursor-pointer" value="configurations">Configuraciones</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="history">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="configurations" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium">Recordatorios Configurados</h3>
                            <p className="text-sm text-gray-100">
                                Configure cuándo y cómo enviar recordatorios a los clientes.
                            </p>
                        </div>
                        <Button onClick={openNotificationForm} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Recordatorio
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {reminderConfigs.map((reminder) => (
                            <Card key={reminder.id} className="bg-zinc-900 border-zinc-800">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-white">{reminder.name}</CardTitle>
                                        <CardDescription>
                                            {reminder.daysBefore === 0
                                                ? "El mismo día del vencimiento"
                                                : `${reminder.daysBefore} días antes del vencimiento`}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch checked={reminder.isActive} onCheckedChange={() => handleToggleActive(reminder.id)} />
                                            <span className="text-sm text-gray-100">{reminder.isActive ? "Activo" : "Inactivo"}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(reminder)}>
                                            <Pencil className="h-4 w-4 text-white" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setOpenDelete(true)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="-mt-6">
                                    <div className="space-y-2 text-white">
                                        <div>
                                            <p className="text-sm font-medium">Asunto:</p>
                                            <p className="text-sm text-gray-100">{reminder.subject}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Mensaje:</p>
                                            <p className="text-sm text-gray-100 line-clamp-2">{reminder.message}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Historial de Recordatorios</h3>
                        <p className="text-sm text-gray-100">Registro de todos los recordatorios enviados.</p>
                    </div>

                    <div className="rounded-md border border-zinc-800 bg-zinc-900 text-white">
                        <TableComponent
                            data={reminderHistory}
                            columns={reminderHistoryColumns}
                            actionTable={() => console.log('')}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {openFormSend && (
                <SendReminders
                    open={openFormSend}
                    setOpen={setOpenFormSend}
                    clients={clients}
                    reminders={reminderConfigs}
                    data={null}
                    onSubmit={sendRemindersApi}
                />
            )}
            {openForm && (
                <NotificationForm
                    open={openForm}
                    setOpen={setOpenForm}
                    data={reminderSelected}
                    onSubmit={getChangesForm}
                />
            )}
            {openDelete && (
                <DeleteReminderDialog
                    open={openDelete}
                    setOpen={setOpenDelete}
                    onDelete={deleteReminderApi}
                />
            )}
        </div>
    )
}
